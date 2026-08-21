export const portalRegistry = {
  identity: {
    url: (import.meta as any).env.VITE_IDENTITY_PORTAL_URL || '/identity-portal',
  },
  student: {
    url: (import.meta as any).env.VITE_STUDENT_PORTAL_URL || '/student-portal',
  },
  applicant: {
    url: (import.meta as any).env.VITE_APPLICANT_PORTAL_URL || '/applicant-portal',
  },
  faculty: {
    url: (import.meta as any).env.VITE_FACULTY_PORTAL_URL || '/faculty-portal',
  },
  finance: {
    url: (import.meta as any).env.VITE_FINANCE_CONSOLE_URL || '/finance-console',
  },
  governance: {
    url: (import.meta as any).env.VITE_GOVERNANCE_CONSOLE_URL || '/governance-console',
  },
  admin: {
    url: (import.meta as any).env.VITE_ADMIN_PORTAL_URL || '/admin-portal',
  },
  library: {
    url: (import.meta as any).env.VITE_LIBRARY_PORTAL_URL || '/library-portal',
  },
  lms: {
    url: (import.meta as any).env.VITE_LMS_WEB_URL || '/lms-web',
  },
  registrar: {
    url: (import.meta as any).env.VITE_REGISTRAR_PORTAL_URL || '/registrar-portal',
  },
  security: {
    url: (import.meta as any).env.VITE_SECURITY_PORTAL_URL || '/security-portal',
  },
  admissions: {
    url: (import.meta as any).env.VITE_ADMISSIONS_PORTAL_URL || '/admissions-portal',
  },
  payment: {
    url: (import.meta as any).env.VITE_PAYMENT_GATEWAY_URL || '/payment-gateway',
  },
  platform: {
    url: (import.meta as any).env.VITE_PLATFORM_CONSOLE_URL || '/platform-console',
  }
};

export const getAllowedOrigins = () => {
    return Object.values(portalRegistry).map(portal => portal.url);
};
