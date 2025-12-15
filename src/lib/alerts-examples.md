# Sistema de Alertas Padronizado

## Como usar:

```tsx
import { alerts } from '@/lib/alerts';

// Sucesso
alerts.success('Operação realizada com sucesso!');

// Erro
alerts.error('Erro ao processar solicitação');

// Aviso
alerts.warning('Preencha todos os campos obrigatórios');

// Informação
alerts.info('Dados salvos automaticamente');

// Loading (retorna ID para dismiss)
const loadingId = alerts.loading('Processando...');
// Para remover: toast.dismiss(loadingId);
```

## Exemplos de uso:

### Formulários
```tsx
const handleSubmit = async () => {
  const loadingId = alerts.loading('Enviando...');
  
  try {
    await submitForm();
    toast.dismiss(loadingId);
    alerts.success('Formulário enviado com sucesso!');
  } catch (error) {
    toast.dismiss(loadingId);
    alerts.error('Erro ao enviar formulário');
  }
};
```

### Validações
```tsx
if (!email) {
  alerts.warning('Email é obrigatório');
  return;
}

if (!isValidEmail(email)) {
  alerts.error('Email inválido');
  return;
}
```

### API Calls
```tsx
try {
  const response = await api.post('/data');
  alerts.success('Dados salvos com sucesso!');
} catch (error) {
  alerts.error('Erro ao salvar dados');
}
```