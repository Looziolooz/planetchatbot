// All the DOM selectors stored as short variables
const chat = document.getElementById('chat');
const sendButton = document.getElementById('send-btn');
const nameInput = document.getElementById('name-input');
const form = document.getElementById('name-form');
const typingIndicator = document.getElementById('typing-indicator');

// Application state
const state = {
  currentQuestion: 1,
  userData: {
    name: '',
    destination: '',
    travelClass: '',
    time: '',
    confirmed: false
  }
};

// Initialize the chat
const initChat = () => {
  // Show greeting after a short delay
  setTimeout(() => {
    showTypingIndicator();
    setTimeout(() => {
      hideTypingIndicator();
      showMessage(`Hello there! My name is JetSetBot. What's your name?`, 'bot');
    }, 1000);
  }, 500);
};

// Set up event listeners
sendButton.addEventListener('click', (event) => {
  event.preventDefault();
  handleUserInput();
});

// Allow sending message with Enter key
nameInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleUserInput();
  }
});

// Functions
const handleUserInput = () => {
  const inputValue = nameInput.value.trim();
  
  if (!inputValue) {
    showMessage(`Please enter a valid response.`, 'bot');
    return;
  }
  
  // Process based on current question
  switch(state.currentQuestion) {
    case 1:
      handleNameInput(inputValue);
      break;
    default:
      showMessage(`Please select an option from the buttons.`, 'bot');
  }
};

const handleNameInput = (name) => {
  state.userData.name = name;
  showMessage(name, 'user');
  nameInput.value = '';
  
  showTypingIndicator();
  setTimeout(() => {
    hideTypingIndicator();
    showDestinationOptions();
    state.currentQuestion++;
  }, 1000);
};

const showDestinationOptions = () => {
  showMessage(`Hi ${state.userData.name}, where do you want to go? Have a look at our available destinations.`, 'bot');
  
  form.innerHTML = `
    <div class="btn-wrapper">
      <button type="button" id="london-btn" class="destination-btn" data-destination="London">LONDON</button>
      <button type="button" id="paris-btn" class="destination-btn" data-destination="Paris">PARIS</button>
      <button type="button" id="rome-btn" class="destination-btn" data-destination="Rome">ROME</button>
    </div>
  `;
  
  // Add event listeners to destination buttons
  document.querySelectorAll('.destination-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const destination = event.target.dataset.destination;
      handleDestinationSelection(destination);
    });
  });
};

const handleDestinationSelection = (destination) => {
  state.userData.destination = destination;
  showMessage(destination, 'user');
  
  showTypingIndicator();
  setTimeout(() => {
    hideTypingIndicator();
    showClassOptions();
    state.currentQuestion++;
  }, 1000);
};

const showClassOptions = () => {
  showMessage(`You have chosen ${state.userData.destination}. Are you flying in business or economy?`, 'bot');
  
  form.innerHTML = `
    <div class="btn-wrapper">
      <button type="button" id="economy-btn" class="class-btn" data-class="economy">ECONOMY</button>
      <button type="button" id="business-btn" class="class-btn" data-class="business">BUSINESS</button>
    </div>
  `;
  
  // Add event listeners to class buttons
  document.querySelectorAll('.class-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const travelClass = event.target.dataset.class;
      handleClassSelection(travelClass);
    });
  });
};

const handleClassSelection = (travelClass) => {
  state.userData.travelClass = travelClass;
  showMessage(travelClass, 'user');
  
  showTypingIndicator();
  setTimeout(() => {
    hideTypingIndicator();
    showTimeOptions();
    state.currentQuestion++;
  }, 1000);
};

const showTimeOptions = () => {
  showMessage(`OK, ${state.userData.travelClass} class it is. Do you prefer a morning or evening flight?`, 'bot');
  
  form.innerHTML = `
    <div class="btn-wrapper">
      <button type="button" id="morning-btn" class="time-btn" data-time="morning">MORNING</button>
      <button type="button" id="evening-btn" class="time-btn" data-time="evening">EVENING</button>
    </div>
  `;
  
  // Add event listeners to time buttons
  document.querySelectorAll('.time-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const time = event.target.dataset.time;
      handleTimeSelection(time);
    });
  });
};

const handleTimeSelection = (time) => {
  state.userData.time = time;
  showMessage(time, 'user');
  
  showTypingIndicator();
  setTimeout(() => {
    hideTypingIndicator();
    showConfirmation();
    state.currentQuestion++;
  }, 1000);
};

const showConfirmation = () => {
  const timeText = state.userData.time === 'morning' ? 'an early' : 'an evening';
  showMessage(`You have chosen ${timeText} flight. Thank you for your selection. Do you want to proceed?`, 'bot');
  
  form.innerHTML = `
    <div class="btn-wrapper">
      <button type="button" id="confirm-btn" class="confirm-btn" data-confirm="true">CONFIRM</button>
      <button type="button" id="decline-btn" class="confirm-btn" data-confirm="false">DECLINE</button>
    </div>
  `;
  
  // Add event listeners to confirmation buttons
  document.querySelectorAll('.confirm-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const confirmed = event.target.dataset.confirm === 'true';
      handleConfirmation(confirmed);
    });
  });
};

const handleConfirmation = (confirmed) => {
  state.userData.confirmed = confirmed;
  showMessage(confirmed ? 'CONFIRM' : 'DECLINE', 'user');
  
  showTypingIndicator();
  setTimeout(() => {
    hideTypingIndicator();
    if (confirmed) {
      showBookingSummary();
    } else {
      showMessage(`You have declined your trip. If you change your mind you know where to find me!`, 'bot');
      form.innerHTML = '';
    }
    state.currentQuestion++;
  }, 1000);
};

const showBookingSummary = () => {
  const summary = `
    Thank you for your booking ${state.userData.name}! Here's your trip summary:
    <br><br>
    <strong>Destination:</strong> ${state.userData.destination}<br>
    <strong>Class:</strong> ${state.userData.travelClass}<br>
    <strong>Flight Time:</strong> ${state.userData.time}<br><br>
    We will send you more information regarding the dates and times of available flights, prices and payment methods.
  `;
  
  showMessage(summary, 'bot');
  form.innerHTML = '';
  
  // Add restart button after a delay
  setTimeout(() => {
    form.innerHTML = `
      <div class="btn-wrapper">
        <button type="button" id="restart-btn">BOOK ANOTHER TRIP</button>
      </div>
    `;
    
    document.getElementById('restart-btn').addEventListener('click', (event) => {
      event.preventDefault();
      restartChat();
    });
  }, 2000);
};

const restartChat = () => {
  // Reset state
  state.currentQuestion = 1;
  state.userData = {
    name: '',
    destination: '',
    travelClass: '',
    time: '',
    confirmed: false
  };
  
  // Clear chat
  chat.innerHTML = '';
  
  // Restore input form
  form.innerHTML = `
    <input id="name-input" type="text" placeholder="Type your name here..." autocomplete="off" />
    <button id="send-btn" class="send-btn" type="submit" aria-label="Send message">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 2L11 13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  `;
  
  // Reattach event listeners
  document.getElementById('send-btn').addEventListener('click', (event) => {
    event.preventDefault();
    handleUserInput();
  });
  
  // Restart the chat
  initChat();
};

const showTypingIndicator = () => {
  typingIndicator.classList.add('active');
  chat.scrollTop = chat.scrollHeight;
};

const hideTypingIndicator = () => {
  typingIndicator.classList.remove('active');
};

const showMessage = (message, sender) => {
  // Create message element based on sender
  const messageElement = document.createElement('div');
  messageElement.className = `${sender}-msg`;
  
  // Create avatar images using SVG
  const botAvatar = `
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="20" fill="#3498db"/>
      <circle cx="14" cy="16" r="2" fill="white"/>
      <circle cx="26" cy="16" r="2" fill="white"/>
      <path d="M14 24 Q20 28 26 24" stroke="white" stroke-width="2" fill="none"/>
    </svg>
  `;
  
  const userAvatar = `
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="20" fill="#e35235"/>
      <circle cx="20" cy="15" r="5" fill="white"/>
      <path d="M10 30 Q20 20 30 30" fill="white"/>
    </svg>
  `;
  
  if (sender === 'user') {
    messageElement.innerHTML = `
      <div class="bubble user-bubble">
        <p>${message}</p>
      </div>
      <div class="avatar">${userAvatar}</div>
    `;
  } else {
    messageElement.innerHTML = `
      <div class="avatar">${botAvatar}</div>
      <div class="bubble bot-bubble">
        <p>${message}</p>
      </div>
    `;
  }
  
  // Add to chat and scroll to bottom
  chat.appendChild(messageElement);
  chat.scrollTop = chat.scrollHeight;
};

// Initialize the chat when page loads
document.addEventListener('DOMContentLoaded', initChat);