// Modelos principales
export { User } from './User';
export { Organization } from './Organization';
export { Department } from './Department';

// Modelos de Auditorías, Hallazgos y Acciones
export { Audit, IAudit } from './Audit';
export { Hallazgos, IHallazgos } from './hallazgos';
export { Acciones, IAcciones } from './acciones';
export { DeclaracionEmpleado, IDeclaracionEmpleado } from './EmployeeDeclaration';
export { EncuestaCliente, IEncuestaCliente } from './CustomerSurvey';

// Nuevos modelos de procesos
export { Proceso } from './PROCESO';
export { RegistroProceso } from './REGISTRO_PROCESO';

// Otros modelos clave
export { QualityIndicator } from './QualityIndicator';
export { QualityObjective } from './QualityObjective';
export { Personnel } from './Personnel';
export { Position } from './Position';
export { Measurement } from './Measurement';
export { NormPoint } from './NormPoint';

// Nota: Otros modelos específicos pueden importarse directamente según necesidad.