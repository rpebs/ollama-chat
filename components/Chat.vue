<template>
    <div class="chat-container">
      <div class="chat-messages">
        <div 
          v-for="(message, index) in messages" 
          :key="index" 
          :class="['chat-message', message.sender]"
        >
          <span class="message-text">{{ message.text }}</span>
        </div>
        <div v-if="isBotTyping" class="bot-typing">Bot is typing...</div>
      </div>
      <div class="input-container">
        <input 
          v-model="inputMessage" 
          @keyup.enter="sendMessage" 
          placeholder="Type your message..." 
          class="message-input"
        />
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue'
  import { useFetch } from '#app'
  
  export default {
    setup() {
      const messages = ref([])
      const inputMessage = ref('')
      const isBotTyping = ref(false)
  
      const sendMessage = async () => {
        if (inputMessage.value.trim() === '') return
  
        // Menambahkan pesan pengguna ke chat
        messages.value.push({ sender: 'user', text: inputMessage.value })
        isBotTyping.value = true
  
        try {
          // Mengirim permintaan ke API
          const { data, error } = await useFetch('/api/chat', {
            method: 'POST',
            body: JSON.stringify({ message: inputMessage.value }),
            headers: {
              'Content-Type': 'application/json'
            }
          })
  
          if (error.value) {
            console.error('Error fetching data:', error.value)
            return
          }
  
          // Menangani respons API
          const rawData = data.value // Mengambil nilai dari Ref
  
          // Mengatasi jika data merupakan beberapa objek JSON
          const jsonStrings = rawData.split('\n').filter(line => line.trim() !== '')
          let fullResponse = ''
  
          // Menggabungkan bagian respons
          jsonStrings.forEach(jsonString => {
            try {
              const jsonData = JSON.parse(jsonString)
              if (jsonData.response) {
                fullResponse += jsonData.response
              }
            } catch (e) {
              console.error('Error parsing JSON:', e)
            }
          })
  
          // Menampilkan respons sebagai satu pesan utuh
          messages.value.push({ sender: 'bot', text: fullResponse })
          isBotTyping.value = false
        } catch (error) {
          console.error('Unexpected error:', error)
        } finally {
          inputMessage.value = ''
        }
      }
  
      return {
        messages,
        inputMessage,
        sendMessage,
        isBotTyping
      }
    }
  }
  </script>
  
  <style scoped>
  .chat-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
    display: flex;
    flex-direction: column;
    height: 80vh;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    background-color: #fff;
    border-radius: 8px;
    border: 1px solid #ddd;
  }
  
  .chat-message {
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 4px;
  }
  
  .chat-message.user {
    background-color: #e0f7fa;
    text-align: right;
  }
  
  .chat-message.bot {
    background-color: #f1f8e9;
    text-align: left;
  }
  
  .message-text {
    display: inline-block;
    padding: 5px 10px;
  }
  
  .bot-typing {
    color: #999;
    font-style: italic;
    text-align: center;
    padding: 10px;
  }
  
  .input-container {
    display: flex;
    margin-top: 10px;
  }
  
  .message-input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
  }
  </style>
  