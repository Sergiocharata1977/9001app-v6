import { DonCandidoUsage } from '../models/DonCandidoUsage';

interface RateLimitConfig {
  perHour: number; // 10
  perMonth: number; // 1000
  warningThreshold: number; // 500
}

interface UsageRecord {
  user_id: string;
  organization_id: string;
  user_name: string;
  module: string;
  question: string;
  response_length: number;
  tokens_used: number;
  cost_usd: number;
  mode: 'claude_api' | 'fallback' | 'simulado';
  response_time_ms: number;
}

class RateLimitService {
  private config: RateLimitConfig = {
    perHour: 10,
    perMonth: 1000,
    warningThreshold: 500,
  };

  /**
   * Verifica si el usuario puede hacer una consulta
   * @returns { allowed: boolean, reason?: string }
   */
  async checkLimit(
    userId: string,
    organizationId: string
  ): Promise<{ allowed: boolean; reason?: string; remaining?: number }> {
    try {
      // Verificar límite por hora
      const hourlyUsage = await this.getHourlyUsage(userId);
      if (hourlyUsage >= this.config.perHour) {
        return {
          allowed: false,
          reason: `Límite horario alcanzado (${this.config.perHour} consultas/hora). Intenta de nuevo en 1 hora.`,
          remaining: 0,
        };
      }

      // Verificar límite mensual de la organización
      const monthlyUsage = await this.getMonthlyUsage(organizationId);
      if (monthlyUsage >= this.config.perMonth) {
        return {
          allowed: false,
          reason: `Límite mensual alcanzado (${this.config.perMonth} consultas/mes). El contador se reiniciará el próximo mes.`,
          remaining: 0,
        };
      }

      // Enviar alerta si se alcanza el threshold de warning
      if (monthlyUsage >= this.config.warningThreshold && monthlyUsage < this.config.warningThreshold + 10) {
        await this.sendWarningEmail(organizationId, monthlyUsage);
      }

      return {
        allowed: true,
        remaining: this.config.perHour - hourlyUsage,
      };
    } catch (error) {
      console.error('[RateLimitService] Error checking limit:', error);
      // En caso de error, permitir la consulta pero loguear
      return { allowed: true };
    }
  }

  /**
   * Registra una consulta en la base de datos
   */
  async recordUsage(record: UsageRecord): Promise<void> {
    try {
      await DonCandidoUsage.create({
        ...record,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('[RateLimitService] Error recording usage:', error);
    }
  }

  /**
   * Obtiene el uso en la última hora
   */
  private async getHourlyUsage(userId: string): Promise<number> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const count = await DonCandidoUsage.countDocuments({
      user_id: userId,
      timestamp: { $gte: oneHourAgo },
    });

    return count;
  }

  /**
   * Obtiene el uso mensual de la organización
   */
  async getMonthlyUsage(organizationId: string): Promise<number> {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const count = await DonCandidoUsage.countDocuments({
      organization_id: organizationId,
      timestamp: { $gte: firstDayOfMonth },
    });

    return count;
  }

  /**
   * Obtiene estadísticas de uso por organización
   */
  async getOrganizationStats(organizationId: string): Promise<{
    monthlyCount: number;
    monthlyCost: number;
    topUsers: Array<{ user_name: string; count: number }>;
    avgSatisfaction: number;
  }> {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyRecords = await DonCandidoUsage.find({
      organization_id: organizationId,
      timestamp: { $gte: firstDayOfMonth },
    });

    const monthlyCount = monthlyRecords.length;
    const monthlyCost = monthlyRecords.reduce((sum, r) => sum + r.cost_usd, 0);

    // Top usuarios
    const userCounts: Record<string, number> = {};
    monthlyRecords.forEach((r) => {
      userCounts[r.user_name] = (userCounts[r.user_name] || 0) + 1;
    });
    const topUsers = Object.entries(userCounts)
      .map(([user_name, count]) => ({ user_name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Satisfacción promedio
    const ratingsCount = monthlyRecords.filter((r) => r.satisfaction_rating).length;
    const avgSatisfaction = ratingsCount > 0
      ? monthlyRecords
          .filter((r) => r.satisfaction_rating)
          .reduce((sum, r) => sum + (r.satisfaction_rating || 0), 0) / ratingsCount
      : 0;

    return {
      monthlyCount,
      monthlyCost: Math.round(monthlyCost * 100) / 100,
      topUsers,
      avgSatisfaction: Math.round(avgSatisfaction * 10) / 10,
    };
  }

  /**
   * Envía email de alerta cuando se alcanza el threshold
   */
  private async sendWarningEmail(organizationId: string, currentUsage: number): Promise<void> {
    try {
      console.warn(`[RateLimitService] Organización ${organizationId} alcanzó ${currentUsage} consultas (threshold: ${this.config.warningThreshold})`);
      
      // TODO: Integrar con servicio de email (SendGrid, AWS SES, etc.)
      // Ejemplo:
      // await emailService.send({
      //   to: adminEmail,
      //   subject: '⚠️ Alerta: Límite de consultas Don Cándido',
      //   body: `La organización ha alcanzado ${currentUsage}/${this.config.perMonth} consultas este mes.`
      // });
    } catch (error) {
      console.error('[RateLimitService] Error sending warning email:', error);
    }
  }

  /**
   * Actualiza la calificación de satisfacción
   */
  async updateSatisfaction(
    usageId: string,
    rating: number
  ): Promise<void> {
    try {
      await DonCandidoUsage.findByIdAndUpdate(usageId, {
        satisfaction_rating: Math.max(1, Math.min(5, rating)), // Clamp 1-5
      });
    } catch (error) {
      console.error('[RateLimitService] Error updating satisfaction:', error);
    }
  }
}

export const rateLimitService = new RateLimitService();

