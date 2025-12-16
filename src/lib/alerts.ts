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

  confirm: (message: string, onConfirm: () => void) => {
    toast(message, {
      duration: Infinity,
      position: 'top-center',
      style: {
        background: '#F59E0B',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '500',
      },
      action: {
        label: 'Sim',
        onClick: () => {
          onConfirm();
        },
      },
      cancel: {
        label: 'Cancelar',
        onClick: () => {},
      },
    });
  },

  delete: async (title: string, message: string, onDelete: () => void, onSuccess?: (name: string) => void, onError?: (message: string) => void) => {
    const Swal = (await import('sweetalert2')).default;
    
    const result = await Swal.fire({
      title: title,
      text: message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
      background: '#ffffff',
      customClass: {
        confirmButton: 'font-semibold',
        cancelButton: 'font-semibold'
      }
    });

    if (result.isConfirmed) {
      try {
        onDelete();
        Swal.fire({
          title: "Excluído com sucesso!",
          text: title,
          icon: "success",
          confirmButtonColor: "#10B981",
          customClass: {
            confirmButton: 'font-semibold'
          }
        });
      } catch (error) {
        Swal.fire({
          title: "Erro ao excluir",
          text: error instanceof Error ? error.message : "Erro desconhecido",
          icon: "error",
          confirmButtonColor: "#EF4444",
          customClass: {
            confirmButton: 'font-semibold'
          }
        });
      }
    }
  },
};