import { type DiaryLevelInfo } from './LevelManager';

export class ThoughtsUI {
  overlay: HTMLElement | null;
  diaryList: HTMLElement | null;
  diaryContent: HTMLElement | null;
  activeFloatingElements: HTMLElement[] = [];

  constructor() {
    this.overlay = document.getElementById('thoughts-overlay');
    this.diaryList = document.getElementById('diary-stages-list');
    this.diaryContent = document.getElementById('diary-content-panel');
  }

  triggerFloatingThought(text: string, x: number, y: number) {
    if (!this.overlay) return;
    const r = document.createElement('div');
    r.className = 'floating-thought';
    r.innerText = text;
    const leftPct = x * 100;
    const topPct = y * 100;
    r.style.left = `${leftPct}%`;
    r.style.top = `${topPct}%`;
    r.style.opacity = '0';
    r.style.transform = 'translate(-50%, 0) scale(0.95)';
    this.overlay.appendChild(r);
    this.activeFloatingElements.push(r);
    requestAnimationFrame(() => {
      r.style.opacity = '0.85';
      r.style.transform = 'translate(-50%, -25px) scale(1)';
    });
    setTimeout(() => {
      r.style.opacity = '0';
      r.style.transform = 'translate(-50%, -65px) scale(1.05)';
      setTimeout(() => {
        if (r.parentNode) {
          r.parentNode.removeChild(r);
        }
        this.activeFloatingElements = this.activeFloatingElements.filter(e => e !== r);
      }, 1500);
    }, 2800);
  }

  showStorySubtitle(text: string, duration = 4000) {
    if (!this.overlay) return;
    const existing = this.overlay.querySelector('.story-subtitle');
    if (existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }
    const r = document.createElement('div');
    r.className = 'story-subtitle';
    this.overlay.appendChild(r);
    let currentText = '';
    let charIdx = 0;
    const typeWriter = () => {
      if (charIdx < text.length) {
        currentText += text.charAt(charIdx);
        r.innerText = currentText;
        charIdx++;
        setTimeout(typeWriter, 35);
      }
    };
    r.style.opacity = '0.9';
    typeWriter();
    setTimeout(() => {
      r.style.opacity = '0';
      r.style.transform = 'translate(-50%, -15px)';
      setTimeout(() => {
        if (r.parentNode) {
          r.parentNode.removeChild(r);
        }
      }, 1200);
    }, duration);
  }

  populateDiary(allLevels: DiaryLevelInfo[], unlockedLevelNumbers: number[]) {
    if (!this.diaryList || !this.diaryContent) return;
    this.diaryList.innerHTML = '';
    allLevels.forEach(level => {
      const isUnlocked = unlockedLevelNumbers.includes(level.number);
      const r = document.createElement('div');
      r.className = `diary-item ${isUnlocked ? '' : 'locked'}`;
      if (isUnlocked) {
        r.innerHTML = `<strong>Fase ${level.number}:</strong> ${level.title}`;
        r.addEventListener('click', () => {
          this.diaryList?.querySelectorAll('.diary-item').forEach(e => e.classList.remove('selected'));
          r.classList.add('selected');
          this.displayDiaryReflection(level);
        });
      } else {
        r.innerHTML = `<strong>Fase ${level.number}:</strong> <em>[Bloqueada]</em>`;
      }
      this.diaryList?.appendChild(r);
    });
  }

  displayDiaryReflection(level: DiaryLevelInfo) {
    if (!this.diaryContent) return;
    this.diaryContent.innerHTML = '';
    this.diaryContent.style.opacity = '0';
    this.diaryContent.style.transition = 'opacity 0.4s ease';
    
    const wrapper = document.createElement('div');
    wrapper.className = 'diary-poetry text-left w-full max-w-xl';
    
    const heading = document.createElement('h3');
    heading.className = 'font-sans text-sm font-semibold tracking-wider text-white uppercase mb-4 pb-2 border-b border-white/5';
    heading.innerText = `Fase ${level.number}: ${level.title} — ${level.tag}`;
    wrapper.appendChild(heading);
    
    const body = document.createElement('p');
    body.className = 'font-serif italic text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap';
    body.innerText = level.diaryText;
    wrapper.appendChild(body);
    
    this.diaryContent.appendChild(wrapper);
    requestAnimationFrame(() => {
      if (this.diaryContent) {
        this.diaryContent.style.opacity = '1';
      }
    });
  }

  clearAll() {
    if (this.overlay) {
      this.overlay.innerHTML = '';
    }
    this.activeFloatingElements = [];
  }
}