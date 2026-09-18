// Voice Service using Web Speech API (HTML5)
// ออกแบบมาเพื่อผู้สูงอายุ: ปรับความเร็วช้าลงเล็กน้อย (0.85x) เสียงดังฟังชัด

class VoiceService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.thaiVoice = null;
    this.isSpeaking = false;

    if (this.synth) {
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    // ค้นหาเสียงภาษาไทย (th-TH หรือ th)
    this.thaiVoice = this.voices.find(v => v.lang.includes('th') || v.lang.includes('TH')) || null;
  }

  speak(text, onStart = null, onEnd = null) {
    if (!this.synth) {
      console.warn('SpeechSynthesis is not supported in this browser.');
      return;
    }

    // หยุดเสียงเก่าก่อนถ้ามี
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'th-TH';
    
    if (this.thaiVoice) {
      utterance.voice = this.thaiVoice;
    }

    // สำหรับคนแก่: พูดช้าลงเล็กน้อย (0.88) เพื่อให้ฟังทัน ไม่รัว
    utterance.rate = 0.88;
    utterance.pitch = 1.05; // โทนเสียงสว่าง อบอุ่น

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.error('Speech error:', e);
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }
}

export const voiceService = new VoiceService();
