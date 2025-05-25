import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;
  private _currentTheme: 'light' | 'dark' = 'light';

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.setTheme(this._currentTheme);
  }

  toggleTheme(): void {
    this._currentTheme = this._currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(this._currentTheme);
  }

  setTheme(theme: 'light' | 'dark'): void {
    const opposite = theme === 'light' ? 'dark' : 'light';
    this.renderer.removeClass(document.body, `${opposite}-theme`);
    this.renderer.addClass(document.body, `${theme}-theme`);
    this._currentTheme = theme;
  }

  getTheme(): 'light' | 'dark' {
    return this._currentTheme;
  }

  get currentTheme(): 'light' | 'dark' {
    return this._currentTheme;
  }

}
