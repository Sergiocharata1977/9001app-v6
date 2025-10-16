
'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Building2 } from 'lucide-react';
import { useOrganization } from '@/contexts/OrganizationContext';
import { departmentService } from '@/services/departmentService';
import { toast } from 'sonner';
import { DepartmentForm } from '../DepartmentForm';

interface EditarDepartamentoModalProps {
  isOpen: boolean;
