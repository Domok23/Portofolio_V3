import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase-comment";
import {
  MessageCircle,
  UserCircle2,
  Loader2,
  AlertCircle,
  Send,
} from "lucide-react";

const Comment = memo(({ comment, formatDate }) => (
  <div className="px-4 pt-4 pb-2 border border-border bg-background hover:border-accent transition-colors duration-200">
    <div className="flex items-start gap-3">
      {comment.profileImage ? (
        <img
          src={comment.profileImage}
          alt={`${comment.userName}'s profile`}
          className="w-10 h-10 object-cover border border-border"
          loading="lazy"
        />
      ) : (
        <div className="p-2 border border-border text-accent">
          <UserCircle2 className="w-5 h-5" />
        </div>
      )}
      <div className="flex-grow min-w-0">
        <div className="flex items-center justify-between gap-4 mb-2">
          <h4 className="font-medium text-foreground truncate">
            {comment.userName}
          </h4>
          <span className="text-xs text-muted whitespace-nowrap">
            {formatDate(comment.createdAt)}
          </span>
        </div>
        <p className="text-muted text-sm break-words leading-relaxed">
          {comment.content}
        </p>
      </div>
    </div>
  </div>
));

const CommentForm = memo(({ onSubmit, isSubmitting }) => {
  const [newComment, setNewComment] = useState("");
  const [userName, setUserName] = useState("");
  const textareaRef = useRef(null);

  const handleTextareaChange = useCallback((e) => {
    setNewComment(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!newComment.trim() || !userName.trim()) return;

      onSubmit({ newComment, userName });
      setNewComment("");
      setUserName("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    },
    [newComment, userName, onSubmit]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name"
          className="w-full p-3 bg-background border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-200"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          ref={textareaRef}
          value={newComment}
          onChange={handleTextareaChange}
          placeholder="Write your message here..."
          className="w-full p-4 bg-background border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-200 resize-none min-h-[120px]"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 bg-accent text-on-accent font-medium transition-opacity duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Posting...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Post Comment</span>
          </>
        )}
      </button>
    </form>
  );
});

const Komentar = () => {
  const [comments, setComments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const commentsRef = collection(db, "portfolio-comments");
    const q = query(commentsRef, orderBy("createdAt", "desc"));

    return onSnapshot(q, (querySnapshot) => {
      const commentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentsData);
    });
  }, []);

  const handleCommentSubmit = useCallback(async ({ newComment, userName }) => {
    setError("");
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "portfolio-comments"), {
        content: newComment,
        userName,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      setError("Failed to post comment. Please try again.");
      console.error("Error adding comment: ", err);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const formatDate = useCallback((timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  }, []);

  return (
    <div>
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 border border-border">
            <MessageCircle className="w-6 h-6 text-accent" />
          </div>
          <h3 className="text-xl font-heading font-semibold text-foreground">
            Comments <span className="text-accent">({comments.length})</span>
          </h3>
        </div>
      </div>
      <div className="p-6 space-y-6">
        {error && (
          <div className="flex items-center gap-2 p-4 text-red-600 bg-red-500/10 border border-red-500/20">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <CommentForm
          onSubmit={handleCommentSubmit}
          isSubmitting={isSubmitting}
        />

        <div className="space-y-4 h-[300px] overflow-y-auto">
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <UserCircle2 className="w-12 h-12 text-muted mx-auto mb-3 opacity-50" />
              <p className="text-muted">
                No comments yet. Start the conversation!
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                formatDate={formatDate}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Komentar;
