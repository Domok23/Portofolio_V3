import { useState } from "react";
import { Share2, Send } from "lucide-react";
import SocialLinks from "../components/SocialLinks";
import Komentar from "../components/Commentar";
import Swal from "sweetalert2";
import { getAccentColor } from "../theme";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import MotionSection from "../components/MotionSection";

const FORMSUBMIT_ENDPOINT =
  "https://formsubmit.co/ajax/wahyu.oktavian231@gmail.com";

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
      <MotionSection className="text-center lg:mt-[5%] mt-10 mb-2 sm:px-0 px-[5%]">
        <h2 className="font-heading text-3xl md:text-5xl font-semibold uppercase tracking-wide text-foreground text-center mx-auto">
          Contact Me
        </h2>
        <p className="font-label uppercase tracking-[0.15em] text-muted max-w-2xl mx-auto text-xs md:text-sm mt-2">
          Got a question? Send me a message, and I&apos;ll get back to you soon.
        </p>
      </MotionSection>

      <div className="h-auto py-10 flex items-center justify-center px-[5%] md:px-0">
        <div className="container px-[1%] grid grid-cols-1 lg:grid-cols-[45%_55%] 2xl:grid-cols-[35%_65%] gap-12">
          <MotionSection delay={0.05}>
            <Card variant="terminal" className="p-5 py-10 sm:p-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="font-heading text-3xl sm:text-4xl font-semibold uppercase tracking-wide mb-3 text-foreground">
                  Get in Touch
                </h2>
                <p className="text-muted tracking-wide">
                  Have something to discuss? Send me a message and let&apos;s
                  talk.
                </p>
              </div>
              <Share2
                className="w-10 h-10 text-accent opacity-50"
                strokeWidth={1.5}
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <Input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
              <Input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
              <Input
                as="textarea"
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                disabled={isSubmitting}
                className="h-[9.9rem]"
                required
              />
              <Button
                type="submit"
                variant="glitch"
                disabled={isSubmitting}
                className="w-full"
              >
                <Send className="w-5 h-5" strokeWidth={1.5} />
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>

            <div className="mt-10 pt-6 border-t border-border flex justify-center">
              <SocialLinks />
            </div>
            </Card>
          </MotionSection>

          <MotionSection delay={0.15}>
            <Card className="p-3 md:p-10 md:py-8">
              <Komentar />
            </Card>
          </MotionSection>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
