
import { defineComponent, onMounted, ref } from 'vue';

interface OpenAIResponse {
    choices: { delta: { content: string } }[];
  }

export default defineComponent({
    name: 'OpenAIComponent',
    setup() {
      const content = ref<string>('');
      const error = ref<string | null>(null);
  
      const apiKey = 'your-api-key'; // **把这个替换成你的实际API密钥**
      const prompt = 'your-prompt';
  
      onMounted(async () => {
        try {
          const response = await fetch('/api/stream-completion', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              apiKey,
              prompt,
            }),
          });
  
          if (!response.ok) {
            throw new Error(`OpenAI API请求失败，状态码：${response.status}`);
          }
  
          const reader = response.body!.getReader();
          const decoder = new TextDecoder();
          let result = '';
  
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              break;
            }
  
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
  
            for (const line of lines) {
              if (line.trim() !== '') {
                try {
                  const data: OpenAIResponse = JSON.parse(line);
                  result += data.choices[0].delta.content;
                  content.value = result;
                } catch (parseError) {
                  console.error('解析JSON时出错:', parseError);
                }
              }
            }
          }
        } catch (fetchError) {
          error.value = (fetchError as Error).message;
        }
      });
  
      return {
        content,
        error,
      };
    },
  });