import { useState, useEffect, useRef, useCallback, memo } from "react";
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
import Button from "./ui/Button";
import Input from "./ui/Input";

const Comment = memo(({ comment, formatDate }) => (
  <div className="px-4 pt-4 pb-2 border border-border bg-background cyber-chamfer-sm hover:border-accent hover:shadow-neon-sm transition-all duration-150">
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
          <UserCircle2 className="w-5 h-5" strokeWidth={1.5} />
        </div>
      )}
      <div className="flex-grow min-w-0">
        <div className="flex items-center justify-between gap-4 mb-2">
          <h4 className="font-medium text-foreground truncate">
            {comment.userName}
          </h4>
          <span className="font-label text-xs uppercase tracking-wider text-muted whitespace-nowrap">
            {formatDate(comment.createdAt)}
          </span>
        </div>
        <p className="text-muted text-sm break-words leading-relaxed tracking-wide">
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
        <label className="block font-label text-sm uppercase tracking-wider text-foreground">
          Name <span className="text-destructive">*</span>
        </label>
        <Input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block font-label text-sm uppercase tracking-wider text-foreground">
          Message <span className="text-destructive">*</span>
        </label>
        <Input
          as="textarea"
          ref={textareaRef}
          value={newComment}
          onChange={handleTextareaChange}
          placeholder="Write your message here..."
          className="min-h-[120px]"
          required
        />
      </div>

      <Button
        type="submit"
        variant="glitch"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Posting...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" strokeWidth={1.5} />
            <span>Post Comment</span>
          </>
        )}
      </Button>
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
          <div className="p-2 border border-border hover:shadow-neon-sm">
            <MessageCircle className="w-6 h-6 text-accent" strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-heading font-semibold uppercase tracking-wide text-foreground">
            Comments <span className="text-accent">({comments.length})</span>
          </h3>
        </div>
      </div>
      <div className="p-6 space-y-6">
        {error && (
          <div className="flex items-center gap-2 p-4 text-destructive bg-destructive/10 border border-destructive/30">
            <AlertCircle className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
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
              <UserCircle2 className="w-12 h-12 text-muted mx-auto mb-3 opacity-50" strokeWidth={1.5} />
              <p className="text-muted font-label uppercase tracking-wider text-sm">
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
