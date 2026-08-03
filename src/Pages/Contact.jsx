import React, { useState } from "react";
import { Share2, User, Mail, MessageSquare, Send } from "lucide-react";
import SocialLinks from "../components/SocialLinks";
import Komentar from "../components/Commentar";
import Swal from "sweetalert2";
import { getAccentColor } from "../theme";

const FORMSUBMIT_ENDPOINT =
  "https://formsubmit.co/ajax/wahyu.oktavian231@gmail.com";

const fieldClass =
  "w-full p-4 pl-12 bg-background border border-border placeholder:text-muted text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-200 hover:border-accent disabled:opacity-50";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    Swal.fire({
      title: "Sending Message...",
      html: "Please wait while we send your message",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await fetch(FORMSUBMIT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _template: "table",
          _captcha: "false",
          _subject: `Portfolio contact from ${formData.name}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`FormSubmit failed with status ${response.status}`);
      }

      await Swal.fire({
        title: "Success!",
        text: "Your message has been sent successfully!",
        icon: "success",
        confirmButtonColor: getAccentColor(),
        timer: 2000,
        timerProgressBar: true,
      });

      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form error:", error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong. Please try again later.",
        icon: "error",
        confirmButtonColor: getAccentColor(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background" id="Contact">
      <div className="text-center lg:mt-[5%] mt-10 mb-2 sm:px-0 px-[5%]">
        <h2
          data-aos="fade-up"
          data-aos-duration="1000"
          className="font-heading text-3xl md:text-5xl font-semibold text-foreground text-center mx-auto"
        >
          Contact Me
        </h2>
        <p
          data-aos="fade-up"
          data-aos-duration="1100"
          className="text-muted max-w-2xl mx-auto text-sm md:text-base mt-2"
        >
          Got a question? Send me a message, and I&apos;ll get back to you soon.
        </p>
      </div>

      <div className="h-auto py-10 flex items-center justify-center px-[5%] md:px-0">
        <div className="container px-[1%] grid grid-cols-1 lg:grid-cols-[45%_55%] 2xl:grid-cols-[35%_65%] gap-12">
          <div
            data-aos="fade-up"
            data-aos-duration="1200"
            className="bg-surface border border-border p-5 py-10 sm:p-10"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="font-heading text-4xl font-semibold mb-3 text-foreground">
                  Get in Touch
                </h2>
                <p className="text-muted">
                  Have something to discuss? Send me a message and let&apos;s
                  talk.
                </p>
              </div>
              <Share2 className="w-10 h-10 text-accent opacity-50" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="relative group">
                <User className="absolute left-4 top-4 w-5 h-5 text-muted group-focus-within:text-accent transition-colors" />
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={fieldClass}
                  required
                />
              </div>
              <div className="relative group">
                <Mail className="absolute left-4 top-4 w-5 h-5 text-muted group-focus-within:text-accent transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={fieldClass}
                  required
                />
              </div>
              <div className="relative group">
                <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-muted group-focus-within:text-accent transition-colors" />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`${fieldClass} resize-none h-[9.9rem]`}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent text-on-accent py-4 font-semibold transition-opacity duration-200 hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send className="w-5 h-5" />
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>

            <div className="mt-10 pt-6 border-t border-border flex justify-center">
              <SocialLinks />
            </div>
          </div>

          <div className="bg-surface border border-border p-3 md:p-10 md:py-8">
            <Komentar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
