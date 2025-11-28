export default function NoFlashThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
        (function() {
        try {
            var cookie = document.cookie.split(';').map(function(c){return c.trim()}).find(function(c){return c.indexOf('__theme__=')===0});
            var pref = cookie ? decodeURIComponent(cookie.split('=')[1]) : 'system';
            var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            var dark = pref === 'dark' || (pref === 'system' && systemDark);
            var root = document.documentElement;
            if (dark) {
            root.classList.add('dark');
            } else {
            root.classList.remove('dark');
            }
            // Keep color-scheme in sync to avoid UA style flashes
            root.style.colorScheme = dark ? 'dark' : 'light';
        } catch (e) {}
        })();
        `.trim(),
      }}
    />
  );
}
