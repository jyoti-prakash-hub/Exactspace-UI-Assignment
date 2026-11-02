import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import "./App.css";

const users = ["Alan", "Bob", "Carol", "Dean", "Elin"];

const userColors = {
  Alan: "#d99b67",
  Bob: "#6d9bd3",
  Carol: "#70ad91",
  Dean: "#a18bd1",
  Elin: "#d58ba5",
};

const emojiData = [
  { icon: "😀", name: "Grinning Face", keywords: "smile happy" },
  { icon: "😂", name: "Face with Tears of Joy", keywords: "laugh funny" },
  { icon: "😍", name: "Heart Eyes", keywords: "love heart" },
  { icon: "😊", name: "Smiling Face", keywords: "smile happy" },
  { icon: "👍", name: "Thumbs Up", keywords: "like approve" },
  { icon: "❤️", name: "Red Heart", keywords: "love" },
  { icon: "🎉", name: "Party Popper", keywords: "celebrate party" },
  { icon: "🔥", name: "Fire", keywords: "hot fire" },
  { icon: "👏", name: "Clapping Hands", keywords: "applause clap" },
  { icon: "🙌", name: "Raising Hands", keywords: "celebrate" },
  { icon: "🤝", name: "Handshake", keywords: "agreement" },
  { icon: "😎", name: "Cool Face", keywords: "cool sunglasses" },
  { icon: "👋", name: "Waving Hand", keywords: "wave hello bye" },
  { icon: "🙏", name: "Folded Hands", keywords: "thanks please" },
  { icon: "💯", name: "Hundred Points", keywords: "perfect score" },
  { icon: "🌟", name: "Glowing Star", keywords: "star" },
  { icon: "😢", name: "Crying Face", keywords: "sad cry" },
  { icon: "🚀", name: "Rocket", keywords: "launch space" },
  { icon: "💡", name: "Light Bulb", keywords: "idea" },
  { icon: "☕", name: "Coffee", keywords: "drink" },
];

const channels = ["Poland Office", "Introductions", "India Office"];

const startingMessages = [
  {
    id: 1,
    author: "Alan",
    text: "Hey everyone! Welcome to our team channel.",
    time: "10:30 AM",
    likes: 2,
  },
  {
    id: 2,
    author: "Elin",
    text: "Hello! Happy to be part of this team. Looking forward to working with you all!",
    time: "10:32 AM",
    likes: 1,
  },
  {
    id: 3,
    author: "Carol",
    text: "Welcome everyone! Let's share ideas and learn together. 🎉",
    time: "10:35 AM",
    likes: 3,
  },
];

export default function App() {
  const [messages, setMessages] = useState(startingMessages);
  const [message, setMessage] = useState("");
  const [activeChannel, setActiveChannel] = useState("Introductions");
  const [channelSearch, setChannelSearch] = useState("");
  const [messageSearch, setMessageSearch] = useState("");
  const [showMessageSearch, setShowMessageSearch] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [emojiSearch, setEmojiSearch] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [showMentions, setShowMentions] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [likedMessages, setLikedMessages] = useState([]);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const filteredChannels = useMemo(
    () =>
      channels.filter((channel) =>
        channel.toLowerCase().includes(channelSearch.toLowerCase())
      ),
    [channelSearch]
  );

  const filteredMessages = useMemo(
    () =>
      messages.filter((item) =>
        `${item.author} ${item.text}`
          .toLowerCase()
          .includes(messageSearch.toLowerCase())
      ),
    [messages, messageSearch]
  );

  const filteredEmojis = useMemo(
    () =>
      emojiData.filter((emoji) =>
        `${emoji.name} ${emoji.keywords}`
          .toLowerCase()
          .includes(emojiSearch.toLowerCase())
      ),
    [emojiSearch]
  );

  const totalLikes = useMemo(
    () => messages.reduce((total, item) => total + item.likes, 0),
    [messages]
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(() => {
    const text = message.trim();
    if (!text) return;

    const previousAuthor = messages[messages.length - 1]?.author;
    const availableUsers = users.filter((user) => user !== previousAuthor);
    const author =
      availableUsers[Math.floor(Math.random() * availableUsers.length)];

    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        author,
        text,
        time,
        likes: 0,
      },
    ]);

    setMessage("");
    setShowEmoji(false);
    setShowMentions(false);
    setEmojiSearch("");
    inputRef.current?.focus();
  }, [message, messages]);

  function toggleLike(id) {
    const alreadyLiked = likedMessages.includes(id);

    setLikedMessages((prev) =>
      alreadyLiked ? prev.filter((item) => item !== id) : [...prev, id]
    );

    setMessages((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, likes: Math.max(0, item.likes + (alreadyLiked ? -1 : 1)) }
          : item
      )
    );
  }

  function insertEmoji(emoji) {
    setMessage((prev) => prev + emoji);
    setSelectedEmoji(emojiData.find((item) => item.icon === emoji));
    setShowEmoji(false);
    inputRef.current?.focus();
  }

  function insertMention(user) {
    setMessage((prev) => prev.replace(/@\w*$/, `@${user} `));
    setShowMentions(false);
    inputRef.current?.focus();
  }

  function handleMessageChange(value) {
    setMessage(value);
    setShowMentions(/@\w*$/.test(value));
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">C</div>
          <div>
            <h1>Connectly</h1>
            <span>Team workspace</span>
          </div>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <div className="sidebar-heading">
          <span>Conversations</span>
          <button
            className="add-button"
            title="New conversation"
            onClick={() => setChannelSearch("")}
          >
            +
          </button>
        </div>

        <div className="channel-search">
          <span>⌕</span>
          <input
            value={channelSearch}
            onChange={(e) => setChannelSearch(e.target.value)}
            placeholder="Find a conversation"
          />
        </div>

        <div className="conversation-list">
          {filteredChannels.map((channel) => (
            <button
              key={channel}
              className={`conversation ${
                activeChannel === channel ? "selected" : ""
              }`}
              onClick={() => {
                setActiveChannel(channel);
                setMessageSearch("");
              }}
            >
              <span className="hash-icon">#</span>
              <span>{channel}</span>
              {channel === "Introductions" && (
                <span className="channel-indicator"></span>
              )}
            </button>
          ))}

          {filteredChannels.length === 0 && (
            <p className="no-channels">No conversations found</p>
          )}
        </div>

        <div className="sidebar-bottom">
          <div className="profile-avatar">Y</div>
          <div className="profile-info">
            <strong>Your workspace</strong>
            <span><i className="online-dot"></i> Online</span>
          </div>
          <span className="profile-menu">•••</span>
        </div>
      </aside>

      <main className="chat-area">
        <header className="chat-header">
          <div className="header-left">
            <div className="channel-icon">#</div>
            <div>
              <h2>{activeChannel}</h2>
              <p>Share updates, ideas and conversations with your team.</p>
            </div>
          </div>

          <div className="header-actions">
            <div className="active-status">
              <span className="online-dot"></span> Active
            </div>
            <button
              className="header-icon"
              title="Search messages"
              onClick={() => setShowMessageSearch(!showMessageSearch)}
            >
              ⌕
            </button>
            <button
              className="header-icon"
              title="View members"
              onClick={() => setShowMembers(!showMembers)}
            >
              ♙
            </button>
          </div>
        </header>

        {showMessageSearch && (
          <div className="message-search-bar">
            <span>⌕</span>
            <input
              autoFocus
              value={messageSearch}
              onChange={(e) => setMessageSearch(e.target.value)}
              placeholder="Search messages or authors..."
            />
            <button onClick={() => {
              setShowMessageSearch(false);
              setMessageSearch("");
            }}>✕</button>
          </div>
        )}

        {showMembers && (
          <div className="members-panel">
            <div className="members-title">
              <strong>Team members</strong>
              <button onClick={() => setShowMembers(false)}>✕</button>
            </div>
            {users.map((user) => (
              <div className="member-row" key={user}>
                <div className="mini-avatar" style={{ background: userColors[user] }}>
                  {user[0]}
                </div>
                <span>{user}</span>
                <i className="online-dot"></i>
              </div>
            ))}
          </div>
        )}

        <section className="message-area">
          <div className="date-divider">
            <span>Today</span>
          </div>

          {activeChannel === "Introductions" ? (
            <>
              <div className="welcome-card">
                <div className="welcome-icon">✦</div>
                <div>
                  <h3>Welcome to Introductions!</h3>
                  <p>
                    This is the place to say hello, meet your teammates and
                    start a conversation.
                  </p>
                </div>
              </div>

              {filteredMessages.map((item) => (
                <div className="message-row" key={item.id}>
                  <div
                    className="avatar"
                    style={{ backgroundColor: userColors[item.author] }}
                  >
                    {item.author.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="message-content">
                    <div className="message-meta">
                      <strong>{item.author}</strong>
                      <span>{item.time}</span>
                    </div>
                    <div className="message-bubble">{item.text}</div>
                  </div>

                  <button
                    className={`like-button ${
                      likedMessages.includes(item.id) ? "is-liked" : ""
                    }`}
                    onClick={() => toggleLike(item.id)}
                    title="Like message"
                  >
                    <span>{likedMessages.includes(item.id) ? "♥" : "♡"}</span>
                    <span>{item.likes}</span>
                  </button>
                </div>
              ))}

              {filteredMessages.length === 0 && (
                <div className="no-results">
                  <span>⌕</span>
                  <strong>No messages found</strong>
                  <p>Try another search term.</p>
                </div>
              )}
            </>
          ) : (
            <div className="channel-empty">
              <div className="channel-empty-icon">#</div>
              <h3>Welcome to {activeChannel}</h3>
              <p>Start a conversation by sending a message below.</p>
            </div>
          )}

          <div ref={bottomRef} />
        </section>

        <footer className="composer-area">
          {showEmoji && (
            <div className="emoji-popup">
              <div className="emoji-categories">
                <span>◷</span><span>😀</span><span>👋</span>
                <span>❤️</span><span>⚽</span><span>🚩</span>
              </div>

              <input
                className="emoji-search"
                value={emojiSearch}
                onChange={(e) => setEmojiSearch(e.target.value)}
                placeholder="Search all emoji"
              />

              <div className="emoji-title">
                {emojiSearch ? "Search Results" : "Frequently Used"}
              </div>

              <div className="emoji-grid">
                {filteredEmojis.map((emoji) => (
                  <button
                    key={emoji.name}
                    title={emoji.name}
                    onClick={() => insertEmoji(emoji.icon)}
                  >
                    {emoji.icon}
                  </button>
                ))}
              </div>

              {selectedEmoji && (
                <div className="emoji-selected">
                  <span>{selectedEmoji.icon}</span>
                  <div>
                    <strong>{selectedEmoji.name}</strong>
                    <p>:{selectedEmoji.name.toLowerCase().replaceAll(" ", "_")}:</p>
                  </div>
                </div>
              )}

              {filteredEmojis.length === 0 && (
                <p className="emoji-no-results">No emoji found</p>
              )}
            </div>
          )}

          {showMentions && (
            <div className="mention-popup">
              <strong>Mention a teammate</strong>
              {users.map((user) => (
                <button key={user} onClick={() => insertMention(user)}>
                  <span className="mini-avatar" style={{ background: userColors[user] }}>
                    {user[0]}
                  </span>
                  {user}
                </button>
              ))}
            </div>
          )}

          <div className="composer-tools">
            <button
              className={`tool-button ${showEmoji ? "tool-active" : ""}`}
              onClick={() => {
                setShowEmoji(!showEmoji);
                setShowMentions(false);
              }}
              title="Add emoji"
            >
              ☺
            </button>
            <button
              className="tool-button"
              onClick={() => {
                setMessage((prev) => prev + "@");
                setShowMentions(true);
                setShowEmoji(false);
              }}
              title="Mention someone"
            >
              @
            </button>
            <span className="composer-hint">
              Add emoji or mention someone
            </span>
          </div>

          <div className="input-row">
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => handleMessageChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={`Message in ${activeChannel}...`}
              rows="1"
            />
            <button
              className="send-button"
              onClick={sendMessage}
              disabled={!message.trim()}
            >
              Send <span>➤</span>
            </button>
          </div>

          <div className="composer-footer">
            <span><kbd>Enter</kbd> to send</span>
            <span><kbd>Shift + Enter</kbd> for a new line</span>
          </div>
        </footer>
      </main>

      <div className="app-statusbar">
        <span><i className="online-dot"></i> All systems operational</span>
        <span>{messages.length} messages · {totalLikes} likes</span>
      </div>
    </div>
  );
}