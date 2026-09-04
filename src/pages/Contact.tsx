import React, { useState } from 'react';
import { Send, MapPin, Mail, User, Phone, Clock, Linkedin, Instagram, Facebook, Youtube, Github, Loader2, CheckCircle } from 'lucide-react';
import { API_BASE_URL } from '../config/api';
import { AdSenseBanner } from '../components/ui/AdSenseBanner';


export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async () => {
    if (!name || !email || !message) {
      alert("Please fill out all fields.");
      return;
    }
    
    setIsLoading(true);
    setStatus('idle');
    try {
      const response = await fetch(`${API_BASE_URL}/contact/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        setStatus('success');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neo-bg font-sans selection:bg-neo-yellow pt-24 pb-20" style={{ backgroundImage: 'radial-gradient(circle, #e5e7eb 2px, transparent 2.5px)', backgroundSize: '32px 32px' }}>
      <div className="container mx-auto px-4 max-w-6xl">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* CONTACT INFO */}
          <div>
            <div className="inline-block bg-neo-yellow border-4 border-black px-6 py-2 font-black uppercase text-xl shadow-[6px_6px_0px_0px_#000] mb-6 rotate-[-2deg] rounded-xl">
              Get In Touch
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.9] tracking-tighter mb-8 bg-white border-4 border-black inline-block p-4 shadow-[12px_12px_0px_0px_#000] rounded-2xl">
              CONTACT US
            </h1>
            <p className="font-bold text-2xl mb-12 bg-neo-pink border-4 border-black p-4 shadow-[6px_6px_0px_0px_#000] inline-block rounded-xl">
              Have a question? Found a bug? Just want to say hi? Drop us a message below!
            </p>

            <div className="space-y-6">
              
              <div className="bg-white border-4 border-black p-6 flex items-center gap-6 shadow-[8px_8px_0px_0px_#000] rounded-2xl">
                <div className="bg-neo-blue border-4 border-black p-3 shrink-0 rounded-xl">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-xl uppercase mb-1">Contact Person</h3>
                  <p className="font-bold text-gray-700">Debasish Baidya</p>
                </div>
              </div>

              <div className="bg-white border-4 border-black p-6 flex items-center gap-6 shadow-[8px_8px_0px_0px_#000] rounded-2xl">
                <div className="bg-neo-green border-4 border-black p-3 shrink-0 rounded-xl">
                  <Phone className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h3 className="font-black text-xl uppercase mb-1">Phone Number</h3>
                  <p className="font-bold text-gray-700">+91 62891 71798</p>
                </div>
              </div>
              
              <div className="bg-white border-4 border-black p-6 flex items-center gap-6 shadow-[8px_8px_0px_0px_#000] rounded-2xl">
                <div className="bg-neo-pink border-4 border-black p-3 shrink-0 rounded-xl">
                  <Mail className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h3 className="font-black text-xl uppercase mb-1">Email Address</h3>
                  <p className="font-bold text-gray-700">naiyooffice@gmail.com</p>
                </div>
              </div>

              <div className="bg-white border-4 border-black p-6 flex items-center gap-6 shadow-[8px_8px_0px_0px_#000] rounded-2xl">
                <div className="bg-neo-purple border-4 border-black p-3 shrink-0 rounded-xl">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-xl uppercase mb-1">Business Hours</h3>
                  <p className="font-bold text-gray-700">Mon - Sat: 12:00 PM - 7:00 PM</p>
                </div>
              </div>

              <div className="bg-white border-4 border-black p-6 flex items-center gap-6 shadow-[8px_8px_0px_0px_#000] rounded-2xl">
                <div className="bg-neo-yellow border-4 border-black p-3 shrink-0 rounded-xl">
                  <MapPin className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h3 className="font-black text-xl uppercase mb-1">Location</h3>
                  <p className="font-bold text-sm text-gray-700">
                    Naiyo24 Private Limited<br />
                    1/30B, Chittaranjan Colony, Baghajatin<br />
                    Kolkata, West Bengal 700032, India
                  </p>
                </div>
              </div>
              
            </div>

            <div className="mt-12 w-full h-[400px]">
              <iframe 
                src="https://maps.google.com/maps?q=Naiyo24%20Private%20Limited,%201/30B,%20Chittaranjan%20Colony,%20Baghajatin&t=&z=16&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true}
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade" 
                className="border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_#000] grayscale-[20%] contrast-125"
              ></iframe>
            </div>

            <div className="mt-12">
              <h3 className="font-black text-2xl uppercase mb-6 bg-white border-4 border-black p-4 inline-block shadow-[6px_6px_0px_0px_#000] rounded-xl">Connect with Us</h3>
              <div className="flex gap-4 flex-wrap">
                <a href="https://www.linkedin.com/company/naiyo24-official/" target="_blank" rel="noreferrer" className="bg-white border-4 border-black p-3 rounded-full hover:bg-blue-500 hover:text-white shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 transition-all">
                  <Linkedin className="w-8 h-8" />
                </a>
                <a href="https://www.instagram.com/naiyo24_official/" target="_blank" rel="noreferrer" className="bg-white border-4 border-black p-3 rounded-full hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-600 hover:text-white shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 transition-all">
                  <Instagram className="w-8 h-8" />
                </a>
                <a href="https://www.facebook.com/Naiyo24/" target="_blank" rel="noreferrer" className="bg-white border-4 border-black p-3 rounded-full hover:bg-blue-600 hover:text-white shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 transition-all">
                  <Facebook className="w-8 h-8" />
                </a>
                <a href="https://www.youtube.com/@naiyo24_official" target="_blank" rel="noreferrer" className="bg-white border-4 border-black p-3 rounded-full hover:bg-red-600 hover:text-white shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 transition-all">
                  <Youtube className="w-8 h-8" />
                </a>
                <a href="https://github.com/naiyo-24" target="_blank" rel="noreferrer" className="bg-white border-4 border-black p-3 rounded-full hover:bg-gray-800 hover:text-white shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 transition-all">
                  <Github className="w-8 h-8" />
                </a>
                <a href="mailto:naiyooffice@gmail.com" target="_blank" rel="noreferrer" className="bg-white border-4 border-black p-3 rounded-full hover:bg-red-500 hover:text-white shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 transition-all">
                  <Mail className="w-8 h-8" />
                </a>
              </div>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="bg-white border-4 border-black p-8 md:p-12 shadow-[16px_16px_0px_0px_#000] rounded-3xl h-fit">
            <form className="space-y-6">
              <div>
                <label className="block font-black uppercase text-xl mb-2">Name</label>
                <input 
                  type="text" 
                  placeholder="JOHN DOE"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-100 border-4 border-black p-4 text-xl font-bold focus:outline-none focus:bg-neo-yellow focus:shadow-[4px_4px_0px_0px_#000] transition-all rounded-xl"
                />
              </div>
              
              <div>
                <label className="block font-black uppercase text-xl mb-2">Email</label>
                <input 
                  type="email" 
                  placeholder="HELLO@EXAMPLE.COM"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-100 border-4 border-black p-4 text-xl font-bold focus:outline-none focus:bg-neo-yellow focus:shadow-[4px_4px_0px_0px_#000] transition-all rounded-xl"
                />
              </div>

              <div>
                <label className="block font-black uppercase text-xl mb-2">Message</label>
                <textarea 
                  rows={5}
                  placeholder="TYPE YOUR MESSAGE HERE..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-gray-100 border-4 border-black p-4 text-xl font-bold focus:outline-none focus:bg-neo-yellow focus:shadow-[4px_4px_0px_0px_#000] transition-all resize-none rounded-xl"
                ></textarea>
              </div>

              {status === 'success' && (
                <div className="bg-neo-green text-black font-bold border-4 border-black p-4 rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  Message sent successfully!
                </div>
              )}

              {status === 'error' && (
                <div className="bg-neo-pink text-black font-bold border-4 border-black p-4 rounded-xl">
                  Failed to send message. Please try again.
                </div>
              )}

              <button 
                type="button" 
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-black text-white font-black uppercase text-2xl border-4 border-black py-4 flex items-center justify-center gap-3 shadow-[8px_8px_0px_0px_#FFD13B] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0px_0px_#FFD13B] transition-all mt-4 rounded-xl disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>Sending... <Loader2 className="w-6 h-6 animate-spin" /></>
                ) : (
                  <>Send Message <Send className="w-6 h-6" /></>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    
        {/* ADVERTISEMENT SECTION */}
        <section className="py-8 bg-neo-bg mt-auto">
          <div className="container mx-auto px-6 sm:px-8 max-w-6xl">
            <AdSenseBanner slot="9385720759" style={{ minHeight: '90px' }} />
          </div>
        </section>
</div>
  );
}
