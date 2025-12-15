import { toast } from "sonner";

export const alerts = {
  success: (message: string) => {
    toast.success(message, {
      duration: 3000,
      style: {
        background: '#10B981',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '500',
      },
    });
  },

  error: (message: string) => {
    toast.error(message, {
      duration: 4000,
      style: {
        background: '#EF4444',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '500',
      },
    });
  },

  warning: (message: string) => {
    toast.warning(message, {
      duration: 3500,
      style: {
        background: '#F59E0B',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '500',
      },
    });
  },

  info: (message: string) => {
    toast.info(message, {
      duration: 3000,
      style: {
        background: '#3B82F6',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '500',
      },
    });
  },

  loading: (message: string) => {
    return toast.loading(message, {
      style: {
        background: '#6B7280',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '500',
      },
    });
  },
};