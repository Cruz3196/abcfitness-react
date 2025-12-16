import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  ShoppingBag,
  Calendar,
  Dumbbell,
  HelpCircle,
  Search,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { userStore } from "../../storeData/userStore";
import { productStore } from "../../storeData/productStore";
import { classStore } from "../../storeData/classStore";

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Get user and store data
  const { user } = userStore();
  const { products, fetchAllProducts } = productStore();
  const { classes, fetchAllClasses } = classStore();

  // Generate storage key based on user
  const getStorageKey = () => {
    return user?._id ? `abc_chat_${user._id}` : "abc_chat_guest";
  };

  // Default welcome message
  const getWelcomeMessage = () => ({
    id: 1,
    type: "bot",
    text: user
      ? `Hi ${user.username}! 👋 Welcome back to ABC Fitness. How can I help you today?`
      : "Hi there! 👋 I'm your ABC Fitness assistant. How can I help you today?",
    timestamp: new Date().toISOString(),
  });

  // Load messages from localStorage on mount or user change
  useEffect(() => {
    const savedMessages = localStorage.getItem(getStorageKey());
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed);
      } catch {
        setMessages([getWelcomeMessage()]);
      }
    } else {
      setMessages([getWelcomeMessage()]);
    }
  }, [user]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(getStorageKey(), JSON.stringify(messages));
    }
  }, [messages]);

  // Fetch products and classes if not loaded
  useEffect(() => {
    if (products.length === 0) fetchAllProducts();
    if (classes.length === 0) fetchAllClasses();
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickActions = [
    {
      id: "clothes",
      label: "Shop Clothes",
      icon: ShoppingBag,
      response:
        "Great choice! We have a wide selection of fitness apparel. Let me take you to our store where you can browse workout clothes, activewear, and accessories.",
      action: () => navigate("/store"),
    },
    {
      id: "classes",
      label: "Book a Class",
      icon: Calendar,
      response:
        "Awesome! We offer various fitness classes including yoga, HIIT, strength training, and more. Let me show you our available classes.",
      action: () => navigate("/classes"),
    },
    {
      id: "trainers",
      label: "Find a Trainer",
      icon: Dumbbell,
      response:
        "Looking for personalized training? Our certified trainers can help you reach your fitness goals. Let me show you our team.",
      action: () => navigate("/trainers"),
    },
    {
      id: "search",
      label: "Search Products",
      icon: Search,
      response:
        "Sure! What product are you looking for? Type a keyword like 'shirt', 'shoes', 'yoga mat', etc.",
      action: null,
    },
  ];

  const addBotMessage = (text, delay = 1000, extra = {}) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "bot",
          text,
          timestamp: new Date().toISOString(),
          ...extra,
        },
      ]);
      setIsTyping(false);
    }, delay);
  };

  const handleQuickAction = (action) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "user",
        text: action.label,
        timestamp: new Date().toISOString(),
      },
    ]);

    addBotMessage(action.response);

    if (action.action) {
      setTimeout(() => {
        action.action();
        setIsOpen(false);
      }, 2000);
    }
  };

  // Search products by keyword
  const searchProducts = (query) => {
    const searchTerm = query.toLowerCase();
    return products
      .filter(
        (p) =>
          p.productName?.toLowerCase().includes(searchTerm) ||
          p.productCategory?.toLowerCase().includes(searchTerm) ||
          p.productDescription?.toLowerCase().includes(searchTerm)
      )
      .slice(0, 3); // Return top 3 matches
  };

  // Get recommended classes
  const getClassRecommendations = () => {
    return classes.slice(0, 3); // Return first 3 classes
  };

  // Format product results for chat
  const formatProductResults = (matchedProducts) => {
    if (matchedProducts.length === 0) {
      return "I couldn't find any products matching that. Try searching for something else like 'shirt', 'shoes', or 'yoga'.";
    }

    let response = `I found ${matchedProducts.length} product${
      matchedProducts.length > 1 ? "s" : ""
    } for you:\n\n`;
    matchedProducts.forEach((p, i) => {
      response += `${i + 1}. **${p.productName}** - $${p.productPrice}\n`;
    });
    response += "\nWould you like me to take you to the store to see more?";
    return response;
  };

  // Format class recommendations
  const formatClassResults = (classList) => {
    if (classList.length === 0) {
      return "We don't have any classes available right now. Check back soon!";
    }

    let response = "Here are some classes you might enjoy:\n\n";
    classList.forEach((c, i) => {
      response += `${i + 1}. **${c.name}** - ${c.classType || "Fitness"}\n`;
    });
    response += "\nWant me to show you all available classes?";
    return response;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim().toLowerCase();
    const originalMessage = inputValue.trim();

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "user",
        text: originalMessage,
        timestamp: new Date().toISOString(),
      },
    ]);
    setInputValue("");

    let botResponse = "";
    let navigationAction = null;

    // Check for product search intent
    if (
      userMessage.includes("search") ||
      userMessage.includes("find") ||
      userMessage.includes("looking for")
    ) {
      const searchTerms = userMessage
        .replace(/search|find|looking for|product|products/gi, "")
        .trim();
      if (searchTerms.length > 2) {
        const results = searchProducts(searchTerms);
        botResponse = formatProductResults(results);
      } else {
        botResponse =
          "What would you like to search for? Tell me the product name or type (e.g., 'search yoga mat' or 'find shirts').";
      }
    }
    // Check for recommendations
    else if (
      userMessage.includes("recommend") ||
      userMessage.includes("suggest") ||
      userMessage.includes("popular")
    ) {
      if (
        userMessage.includes("class") ||
        userMessage.includes("workout") ||
        userMessage.includes("exercise")
      ) {
        const classRecs = getClassRecommendations();
        botResponse = formatClassResults(classRecs);
      } else {
        const productRecs = products.slice(0, 3);
        botResponse = formatProductResults(productRecs);
      }
    }
    // Existing keyword matching
    else if (
      userMessage.includes("cloth") ||
      userMessage.includes("shop") ||
      userMessage.includes("buy") ||
      userMessage.includes("apparel") ||
      userMessage.includes("wear") ||
      userMessage.includes("store")
    ) {
      botResponse =
        "I'd be happy to help you find some great fitness gear! Let me take you to our store.";
      navigationAction = () => navigate("/store");
    } else if (
      userMessage.includes("class") ||
      userMessage.includes("book") ||
      userMessage.includes("schedule") ||
      userMessage.includes("yoga") ||
      userMessage.includes("hiit")
    ) {
      botResponse =
        "Looking to book a class? We have plenty of options! Let me show you what's available.";
      navigationAction = () => navigate("/classes");
    } else if (
      userMessage.includes("trainer") ||
      userMessage.includes("coach") ||
      userMessage.includes("personal") ||
      userMessage.includes("training")
    ) {
      botResponse =
        "Our trainers are top-notch! Let me introduce you to our team.";
      navigationAction = () => navigate("/trainers");
    } else if (
      userMessage.includes("hi") ||
      userMessage.includes("hello") ||
      userMessage.includes("hey")
    ) {
      botResponse = user
        ? `Hello ${user.username}! 😊 How can I assist you today?`
        : "Hello! 😊 How can I assist you today? Are you looking for clothes, wanting to book a class, or need help with something else?";
    } else if (userMessage.includes("thank")) {
      botResponse =
        "You're welcome! Is there anything else I can help you with?";
    } else if (
      userMessage.includes("order") ||
      userMessage.includes("purchase") ||
      userMessage.includes("bought")
    ) {
      if (user) {
        botResponse =
          "To check your orders, I can take you to your profile page where all your order history is saved.";
        navigationAction = () => navigate("/profile");
      } else {
        botResponse =
          "Please log in to view your order history. Would you like me to take you to the login page?";
      }
    } else if (userMessage.includes("cart")) {
      botResponse = "Let me take you to your cart!";
      navigationAction = () => navigate("/cart");
    } else if (
      userMessage.includes("login") ||
      userMessage.includes("sign in")
    ) {
      botResponse = "I'll take you to the login page!";
      navigationAction = () => navigate("/login");
    } else {
      // Try to search products with the input
      const results = searchProducts(userMessage);
      if (results.length > 0) {
        botResponse = formatProductResults(results);
      } else {
        botResponse =
          "I'm not quite sure what you're looking for. Here are some things I can help with:\n\n• Search for products (e.g., 'search yoga mat')\n• Browse our store for fitness clothes\n• Book a fitness class\n• Find a personal trainer\n\nJust click a quick action or type your question!";
      }
    }

    addBotMessage(botResponse);

    if (navigationAction) {
      setTimeout(() => {
        navigationAction();
        setIsOpen(false);
      }, 2000);
    }
  };

  // Clear chat history
  const clearChatHistory = () => {
    const welcomeMsg = getWelcomeMessage();
    setMessages([welcomeMsg]);
    localStorage.setItem(getStorageKey(), JSON.stringify([welcomeMsg]));
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 btn btn-circle btn-lg shadow-lg transition-all duration-300 ${
          isOpen ? "btn-error" : "btn-primary"
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat assistant"}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-base-100 rounded-2xl shadow-2xl border border-base-300 transition-all duration-300 transform ${
          isOpen
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="bg-primary text-primary-content p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="avatar placeholder">
                <div className="bg-primary-content text-primary rounded-full w-10">
                  <Dumbbell className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="font-bold">ABC Fitness Assistant</h3>
                <p className="text-xs opacity-80">
                  {user
                    ? `Chatting as ${user.username}`
                    : "Always here to help"}
                </p>
              </div>
            </div>
            <button
              onClick={clearChatHistory}
              className="btn btn-ghost btn-xs btn-circle text-primary-content hover:bg-primary-content/20"
              title="Clear chat history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="h-72 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat ${
                message.type === "user" ? "chat-end" : "chat-start"
              }`}
            >
              <div
                className={`chat-bubble ${
                  message.type === "user"
                    ? "chat-bubble-primary"
                    : "chat-bubble-neutral"
                } whitespace-pre-line text-sm`}
              >
                {message.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="chat chat-start">
              <div className="chat-bubble chat-bubble-neutral">
                <span className="loading loading-dots loading-sm"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action)}
                className="btn btn-xs btn-outline gap-1"
              >
                <action.icon className="w-3 h-3" />
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 pt-2 border-t border-base-300"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search products or ask a question..."
              className="input input-bordered input-sm flex-1"
            />
            <button
              type="submit"
              className="btn btn-primary btn-sm btn-circle"
              disabled={!inputValue.trim()}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChatAssistant;
