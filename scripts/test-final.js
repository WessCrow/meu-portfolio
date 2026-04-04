
const testData = {
  services: [{ title: 'Teste de Domínio Verificado' }],
  parameters: {
    prazo: 'Entrega Rápida',
    investimento: 'R$ 10.000',
    escala: 'Global'
  },
  results: {
    horas: 100,
    semanas: 4,
    preco: 'R$ 10.000'
  },
  contact: {
    name: 'Wess (Teste Final)',
    email: 'contateowess@gmail.com',
    phone: '11 99999-9999',
    observations: 'Este teste valida que o domínio foi verificado com sucesso e que agora podemos enviar para qualquer email.'
  }
};

async function runTest() {
  console.log('Iniciando teste de envio para http://localhost:3000/meu-portfolio/api/send...');
  try {
    const response = await fetch('http://localhost:3000/meu-portfolio/api/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();
    if (response.ok) {
      console.log('Sucesso! Email enviado via Resend após verificação de domínio.');
      console.log('ID do Resend:', result.data?.id);
    } else {
      console.error('Falha no envio:', result.error);
    }
  } catch (error) {
    console.error('Erro na requisição:', error.message);
  }
}

runTest();
