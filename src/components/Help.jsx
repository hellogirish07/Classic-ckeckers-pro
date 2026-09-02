import React, { useState } from 'react';
import { Palette, X, Check } from 'lucide-react';

const HelpPanel = ({ onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_KEY = import.meta.env.VITE_WEB3FORMS_API_KEY || 'YOUR_API_KEY_HERE';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !message) {
      setStatus({ ok: false, msg: 'Please fill in name, email and message.' });
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: API_KEY,
          name,
          email,
          subject,
          message,
        }),
      });

      const json = await res.json();

      if (json.success) {
        setStatus({ ok: true, msg: 'Message sent — we will get back to you shortly.' });
        setName(''); setEmail(''); setSubject(''); setMessage('');
      } else {
        setStatus({ ok: false, msg: json.message || 'Submission failed. Please try again later.' });
      }
    } catch (err) {
      setStatus({ ok: false, msg: 'Network error. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-neutral-900 w-full max-w-lg rounded-2xl p-6 border border-neutral-800 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl text-white font-bold">Help & Report</h3>
          {/* <button onClick={onClose} className="text-neutral-400 hover:text-white">Close</button> */}
            <button onClick={onClose} className="p-2 text-white rounded-2xl transition-all hover:bg-neutral-800 hover:text-red-400">
            <X size={24} />
          </button>
        </div>

        <p className="text-sm text-neutral-400 mb-4">If you encounter a bug or want to contact support, please use the form below or reach out via the provided links.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input className="p-3 bg-neutral-800 text-white placeholder:text-neutral-500 focus:outline-none rounded-2xl focus:ring-2 focus:ring-blue-500" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="p-3 bg-neutral-800 text-white placeholder:text-neutral-500 focus:outline-none rounded-2xl focus:ring-2 focus:ring-blue-500" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <input className="w-full p-3 bg-neutral-800 text-white placeholder:text-neutral-500 focus:outline-none rounded-2xl focus:ring-2 focus:ring-blue-500" placeholder="Subject (optional)" value={subject} onChange={(e) => setSubject(e.target.value)} />

          <textarea className="w-full p-3 bg-neutral-800 text-white placeholder:text-neutral-500 focus:outline-none rounded-2xl focus:ring-2 focus:ring-blue-500 height-[120px]" placeholder="Describe the issue or question" value={message} onChange={(e) => setMessage(e.target.value)} />

          <div className="flex items-center gap-3">
            <button type="submit" disabled={isSubmitting} className="py-2 px-4 bg-blue-600 text-white hover:bg-blue-500 rounded-2xl font-bold">
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
            {/* <button type="button" onClick={onClose} className="py-2 px-4 bg-red-800 hover:bg-neutral-700 rounded-2xl">Cancel</button> */}
          </div>
        </form>

        {status && (
          <div className={`mt-4 p-3 rounded-md ${status.ok ? 'bg-green-800 text-green-100' : 'bg-red-800 text-red-100'}`}>
            {status.msg}
          </div>
        )}

        {/* <div className="mt-6 border-t border-neutral-800 pt-4">
          <h4 className="font-bold text-white mb-2">Other ways to contact</h4>
          <ul className="text-sm text-neutral-300 space-y-2">
            <li>Email: <a className="text-blue-400" href="mailto:support@example.com">support@example.com</a></li>
            <li>Phone: <a className="text-blue-400" href="tel:+1234567890">+1 234 567 890</a></li>
            <li>Report a bug: <a className="text-blue-400" href="https://github.com/your-repo/issues" target="_blank" rel="noreferrer">Open an issue on GitHub</a></li>
          </ul>
          <p className="text-sm text-neutral-500 mt-3">Your support means a lot to us!</p>
        </div>  */}
      </div>
    </div>
  );
};

export default HelpPanel;
