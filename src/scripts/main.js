// Page d'accueil LBA Factory : état de l'interface (sliders, menus) et motion (GSAP, ScrollTrigger, SplitText, Lenis).
// Port direct de la maquette Claude Design ; la logique de motion est volontairement identique.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

Object.assign(window, { gsap, ScrollTrigger, SplitText, Lenis });

const LABELS = {
  a: ['Mettre en pause le défilement des photos', 'Lancer le défilement des photos'],
  b: ['Mettre en pause le défilement des photos de l’agence', 'Lancer le défilement des photos de l’agence'],
};

class App {
  constructor() {
    this.state = { slide: 0, slideB: 0, autoPaused: false, autoPausedB: false, menuOpen: false, langOpen: false };
    this.root = document.querySelector('.lbaf-root');
    this.bindUi();
    this.render();
    this.componentDidMount();
  }

  setState(patch) {
    Object.assign(this.state, patch);
    this.render();
  }

  /** Applique l'état au DOM (équivalent des valeurs calculées de la maquette). */
  render() {
    const st = this.state;
    const STACK = [{"name": "Figma", "d": "M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.097-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z", "letter": "", "c": "#F24E1E", "fg": "#FFFFFF", "desc": "Maquettes, prototypes et design systems partagés avec vos équipes.", "fam": "design"}, {"name": "Claude", "d": "m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z", "letter": "", "c": "#D97757", "fg": "#FFFFFF", "desc": "Assistant d’IA pour explorer, rédiger et prototyper plus vite.", "fam": "design"}, {"name": "Adobe", "d": "", "letter": "A", "c": "#FA0F00", "fg": "#FFFFFF", "desc": "Retouche, illustration et motion avec la suite Creative Cloud.", "fam": "design"}, {"name": "Drupal", "d": "M15.78 5.113C14.09 3.425 12.48 1.815 11.998 0c-.48 1.815-2.09 3.425-3.778 5.113-2.534 2.53-5.405 5.4-5.405 9.702a9.184 9.185 0 1018.368 0c0-4.303-2.871-7.171-5.405-9.702M6.72 16.954c-.563-.019-2.64-3.6 1.215-7.416l2.55 2.788a.218.218 0 01-.016.325c-.61.625-3.204 3.227-3.527 4.126-.066.186-.164.18-.222.177M12 21.677a3.158 3.158 0 01-3.158-3.159 3.291 3.291 0 01.787-2.087c.57-.696 2.37-2.655 2.37-2.655s1.774 1.988 2.367 2.649a3.09 3.09 0 01.792 2.093A3.158 3.158 0 0112 21.677m6.046-5.123c-.068.15-.223.398-.431.405-.371.014-.411-.177-.686-.583-.604-.892-5.864-6.39-6.848-7.455-.866-.935-.122-1.595.223-1.94C10.736 6.547 12 5.285 12 5.285s3.766 3.574 5.336 6.016c1.57 2.443 1.029 4.556.71 5.253", "letter": "", "c": "#0678BE", "fg": "#FFFFFF", "desc": "CMS open source pour les sites et portails riches en contenus.", "fam": "tech"}, {"name": "Symfony", "d": "M24 12c0 6.628-5.372 12-12 12S0 18.628 0 12 5.372 0 12 0s12 5.372 12 12zm-6.753-7.561c-1.22.042-2.283.715-3.075 1.644-.878 1.02-1.461 2.229-1.881 3.461-.753-.614-1.332-1.414-2.539-1.761-.966-.297-2.015-.105-2.813.514-.41.319-.71.757-.861 1.254-.36 1.176.381 2.225.719 2.6l.737.79c.15.154.519.56.339 1.138-.193.631-.951 1.037-1.732.799-.348-.106-.848-.366-.734-.73.045-.15.152-.263.21-.391.052-.11.077-.194.095-.242.141-.465-.053-1.07-.551-1.223-.465-.143-.939-.03-1.125.566-.209.68.117 1.913 1.86 2.449 2.04.628 3.765-.484 4.009-1.932.153-.907-.255-1.582-1.006-2.447l-.612-.677c-.371-.37-.497-1.002-.114-1.485.324-.409.785-.584 1.539-.379 1.103.3 1.594 1.063 2.412 1.68-.338 1.11-.56 2.223-.759 3.222l-.123.746c-.585 3.07-1.033 4.757-2.194 5.726-.234.166-.57.416-1.073.434-.266.005-.352-.176-.355-.257-.006-.184.15-.271.255-.353.154-.083.39-.224.372-.674-.016-.532-.456-.994-1.094-.973-.477.017-1.203.465-1.176 1.286.028.85.819 1.485 2.012 1.444.638-.021 2.062-.281 3.464-1.949 1.633-1.911 2.09-4.101 2.434-5.706l.383-2.116c.213.024.441.042.69.048 2.032.044 3.049-1.01 3.064-1.776.01-.464-.304-.921-.744-.91-.386.009-.718.278-.806.654-.094.428.646.813.068 1.189-.41.266-1.146.452-2.184.3l.188-1.042c.386-1.976.859-4.407 2.661-4.467.132-.007.612.006.623.323.003.105-.022.134-.147.375-.115.155-.174.345-.168.537.017.504.4.836.957.816.743-.023.955-.748.945-1.119-.032-.874-.952-1.424-2.17-1.386z", "letter": "", "c": "#000000", "fg": "#FFFFFF", "desc": "Framework PHP pour des applications métier robustes et maintenables.", "fam": "tech"}, {"name": "PrestaShop", "d": "M11.558 1.034C5.174 1.034 0 6.21 0 12.592c0 1.258.201 2.47.574 3.597l.002-.007a12.415 12.415 0 01.53-1.787l.011-.03c.085-.222.179-.442.277-.66l.084-.181c.08-.171.165-.34.253-.507.036-.068.07-.136.108-.203.02-.038.044-.073.064-.11.094-.166.19-.332.29-.493l.075-.114c.125-.195.256-.386.393-.573l.035-.05c.144-.193.295-.38.451-.563l.1-.118c.155-.177.315-.35.481-.517l.099-.097a10.321 10.321 0 01.546-.503c.74-2.48 3.005-4.285 5.686-4.285 1.079 0 2.152.31 3.071.873a6.017 6.017 0 012.211 2.407l.007.015.04.074v.003l.004.002a9.925 9.925 0 011.567 1.198c.04.037.081.071.12.109.002 0 .006.005.007.006l-.002-.006-.001-.004v-.003l.042-.084c.377-2.384 1.43-4.102 2.67-4.102.934 0 1.762.975 2.276 2.476l.005.016.001.002c.145.158.287.331.424.521l.007.01.021.067-.02-.078c-1.542-4.569-5.863-7.857-10.952-7.857zM9.927 5.477C7.586 5.52 5.34 7.132 4.574 9.365l-.012.034a10.14 10.14 0 011.315-.895c2.806-1.656 6.479-1.646 9.278.016-.895-1.653-2.631-2.819-4.5-3.004a5.14 5.14 0 00-.728-.039zm9.834.5a1.36 1.36 0 00-.39.067c-1.265.562-1.719 2.073-2.031 3.303l-.016.072c.365-.62.808-1.215 1.396-1.642.835-.687 2.105-.655 2.916.053.308.326.141.008.031-.22-.342-.75-1.025-1.653-1.906-1.634zM21.67 7.98zm-9.32.335l-1.07 3.27-.002.005-.006.002-4.498 1.112h-.009l4.456 1.087c.105.11.227.205.36.28h.002c.042.024.085.045.129.065l.01.005c.041.018.083.033.126.047l.021.008c.04.013.08.023.12.032l.033.008a1.677 1.677 0 00.318.033 1.546 1.546 0 001.43-.948c.08-.186.123-.39.123-.604v-.011l-.001-.012c-.001-.054-.004-.107-.01-.16l-.001-.002a1.506 1.506 0 00-.026-.153l-.001-.004a1.511 1.511 0 00-.096-.288v-.003a1.521 1.521 0 00-.348-.49v-.003zm3.148.626c.048 1.008.036 2.046-.1 3.057-.17 2.018-1.19 3.798-1.972 5.616l-.03.08-.035.086c1.51-1.522 3.17-3.04 3.969-5.082.383-.636.118-1.342-.115-1.976-.17-.877-1.069-1.278-1.717-1.781zm6.172.572l-.588 2.688a1.764 1.764 0 00-.047.2c-.002.02-.007.04-.01.06a1.76 1.76 0 00-.016.222l-.002.031h.003c0 .628.297 1.136.663 1.137a.41.41 0 00.182-.045l.027-.015a.537.537 0 00.07-.047c.013-.01.024-.022.036-.033a.752.752 0 00.137-.168l.03-.054a1.23 1.23 0 00.052-.108l.017-.04c.02-.053.038-.108.053-.166l.002-.002.001-.003.404-.451-.407-.456v.001l-.02-.063zm-4.381.856c.69 1.716.85 3.707.091 5.43-.49 1.368-1.587 2.463-1.874 3.905.73.115 1.468.176 2.21.186 2.166.029 4.332-.42 6.284-1.365-2.04-2.869-4.121-5.755-6.711-8.156zm-4.948.977a.583.583 0 110 1.166.583.583 0 010-1.166zm9.352.37c.138 0 .249.19.249.426s-.111.426-.249.426c-.137 0-.248-.19-.248-.426 0-.235.11-.426.248-.426zm-4.044.184c-.016.112-.033.209-.05.29l-.006.023c-.01.05-.022.094-.033.128-.48 1.417-1.275 2.52-2.36 3.697-.147.16-.301.32-.459.484a58.883 58.883 0 01-1.196 1.205c-.112.11-.259.261-.425.436-.103.287-.22.61-.318.95-.044-.016-.086-.031-.131-.049-2.108-.815-3.519-1.904-3.519-1.904s1.086 1.414 2.915 2.74c.177.129.351.24.522.339-.075 1.194.452 2.34 2.83 2.682a4.81 4.81 0 001.228.008l-.01-.029a.062.062 0 00-.004-.01s-.167-.133-.379-.377a3.842 3.842 0 01-.584-.897 3.382 3.382 0 01-.266-.862 3.176 3.176 0 01-.006-.972c.017-.12.04-.241.072-.366.093-.374.255-.772.507-1.192l.002-.003.241-.404c1.103-1.86 1.797-3.275 1.506-5.441a8.943 8.943 0 00-.078-.476zm4.668.576zm.013.203l.003.036v.01c0 .013-.003.025-.003.038 0-.014.003-.028.003-.043 0-.014-.002-.026-.003-.04zm-.012.275v.001l-.002.01-.002.014.004-.025zm1.353 5.928c-2.553 1.138-5.44 1.44-8.192 1.007-.14 1.108.384 2.218 1.214 2.93l.012.01c2.703-.433 4.975-2.168 6.966-3.946z", "letter": "", "c": "#DF0067", "fg": "#FFFFFF", "desc": "Solution e-commerce open source pour des boutiques en ligne sur mesure.", "fam": "tech"}, {"name": "Magento", "d": "", "letter": "M", "c": "#EE672F", "fg": "#FFFFFF", "desc": "Plateforme e-commerce (Adobe Commerce) pour les catalogues et les flux complexes.", "fam": "tech"}, {"name": "React", "d": "M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z", "letter": "", "c": "#61DAFB", "fg": "#0A0A0A", "desc": "Bibliothèque JavaScript pour des interfaces web réactives.", "fam": "tech"}, {"name": "Angular", "d": "M16.712 17.711H7.288l-1.204 2.916L12 24l5.916-3.373-1.204-2.916ZM14.692 0l7.832 16.855.814-12.856L14.692 0ZM9.308 0 .662 3.999l.814 12.856L9.308 0Zm-.405 13.93h6.198L12 6.396 8.903 13.93Z", "letter": "", "c": "#DD0031", "fg": "#FFFFFF", "desc": "Framework front-end pour des applications web structurées et évolutives.", "fam": "tech"}];
    const sk = this.root.querySelector('.stack');
    if (sk) {
      const si = (st.stackIdx || 0) % STACK.length;
      sk.classList.toggle('is-paused', !!st.stackPaused);
      sk.querySelectorAll('.tech-tile').forEach((b) => b.setAttribute('aria-current', Number(b.dataset.index) === si ? 'true' : 'false'));
      sk.querySelector('.tech-desc').textContent = STACK[si].desc;
      const tg = sk.querySelector('.stack-tag'); if (tg) tg.lastChild.textContent = STACK[si].fam === 'design' ? 'Design · LBA France' : 'Tech · Rabat'; if (tg) tg.querySelector('.dot').className = 'dot ' + (STACK[si].fam === 'design' ? 'dot-fr' : 'dot-ma');
    }
    const sliders = { a: { idx: st.slide, paused: st.autoPaused }, b: { idx: st.slideB, paused: st.autoPausedB } };
    this.root.querySelectorAll('.pager[data-slider]').forEach((pager) => {
      const key = pager.dataset.slider;
      const cfg = sliders[key];
      const region = pager.parentElement.querySelector('img.slide') ? pager.parentElement : pager.parentElement.parentElement;
      region.querySelectorAll('img.slide').forEach((img) => {
        const cur = Number(img.dataset.slide) === cfg.idx;
        img.style.opacity = cur ? '1' : '0';
        img.style.transform = 'scale(' + (cur ? 1 : 1.14) + ')';
        img.setAttribute('aria-hidden', cur ? 'false' : 'true');
      });
      pager.querySelectorAll('.pager-dot').forEach((dot) => {
        dot.setAttribute('aria-current', Number(dot.dataset.index) === cfg.idx ? 'true' : 'false');
      });
      pager.classList.toggle('is-paused', cfg.paused);
      pager.querySelectorAll('.s4-prog i').forEach((i, n) => i.setAttribute('data-on', n === cfg.idx ? 'true' : 'false'));
      const cnt = pager.querySelector('.s4-count'); if (cnt) cnt.textContent = '0' + (cfg.idx + 1) + ' / 03';
      const toggle = pager.querySelector('.pager-toggle');
      if (toggle) toggle.setAttribute('aria-label', LABELS[key][cfg.paused ? 1 : 0]);
    });
    const menu = document.getElementById('menu-mobile');
    if (menu) menu.hidden = !st.menuOpen;
    this.root.querySelectorAll('[aria-controls="menu-mobile"]').forEach((b) => b.setAttribute('aria-expanded', st.menuOpen ? 'true' : 'false'));
    const langs = document.getElementById('langues');
    if (langs) langs.hidden = !st.langOpen;
    this.root.querySelectorAll('[aria-controls="langues"]').forEach((b) => b.setAttribute('aria-expanded', st.langOpen ? 'true' : 'false'));
  }

  bindUi() {
    this.root.addEventListener('click', (e) => {
      const el = e.target.closest('[data-action]');
      if (!el || !this.root.contains(el)) return;
      const action = el.dataset.action;
      if (action === 'prev' || action === 'next') { const b = el.dataset.slider === 'b'; const cur = b ? this.state.slideB : this.state.slide; const nx = (cur + (action === 'next' ? 1 : 2)) % 3; this.setState(b ? { slideB: nx } : { slide: nx }); return; }
      if (action === 'stack-pick') { this.setState({ stackIdx: Number(el.dataset.index) }); return; }
      if (action === 'stack-toggle') { this.setState({ stackPaused: !this.state.stackPaused }); return; }
      if (action === 'pick') {
        const key = el.closest('.pager').dataset.slider;
        this.setState(key === 'b' ? { slideB: Number(el.dataset.index) } : { slide: Number(el.dataset.index) });
      } else if (action === 'toggle-auto') {
        if (el.dataset.slider === 'b') this.setState({ autoPausedB: !this.state.autoPausedB });
        else this.setState({ autoPaused: !this.state.autoPaused });
      } else if (action === 'toggle-lang') {
        this.setState({ langOpen: !this.state.langOpen });
      } else if (action === 'open-menu') {
        this.setState({ menuOpen: true });
        if (this._lenis) this._lenis.stop();
        document.documentElement.style.overflow = 'hidden';
        const close = document.querySelector('#menu-mobile .m-close');
        if (close) close.focus();
      } else if (action === 'close-menu') {
        this.setState({ menuOpen: false });
        if (this._lenis) this._lenis.start();
        document.documentElement.style.overflow = '';
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (this.state.menuOpen) { this.setState({ menuOpen: false }); if (this._lenis) this._lenis.start(); document.documentElement.style.overflow = ''; }
      if (this.state.langOpen) this.setState({ langOpen: false });
    });
    document.addEventListener('click', (e) => {
      if (this.state.langOpen && !e.target.closest('.lang-wrap')) this.setState({ langOpen: false });
    });
    this.bindForm();
  }

  bindForm() {
    const form = this.root.querySelector('form[data-contact]');
    if (!form) return;
    const status = form.querySelector('.form-status');
    // Retour d'un envoi sans JavaScript (redirection depuis /api/contact)
    const sent = new URLSearchParams(location.search).get('envoi');
    if (sent && status) {
      status.textContent = sent === 'ok' ? 'Merci, votre message est bien envoyé. Nous revenons vers vous rapidement.' : 'Envoi impossible pour le moment. Réessayez ou écrivez-nous directement.';
      status.classList.toggle('is-error', sent !== 'ok');
    }
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const say = (msg, error) => { status.textContent = msg; status.classList.toggle('is-error', !!error); };
      if (!form.email.value.trim() || !form.message.value.trim()) { say('Indiquez au moins votre e-mail et votre message.', true); return; }
      btn.disabled = true; say('Envoi en cours…');
      try {
        const res = await fetch(form.action, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Envoi impossible');
        form.reset(); say('Merci, votre message est bien envoyé. Nous revenons vers vous rapidement.');
      } catch (err) {
        say((err && err.message) || 'Envoi impossible. Réessayez ou écrivez-nous directement.', true);
      } finally { btn.disabled = false; }
    });
  }

  componentDidMount() {
    let reduce = false;
    try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    this._reduce = reduce;
    if (reduce) this.setState({ autoPaused: true, autoPausedB: true, techPaused: true, toolPaused: true, stackPaused: true });
    // Slide duration is driven by the pager fill animation (5 s): pause freezes it, picking a dot restarts it.
    this._onFill = (e) => {
      if (e.animationName === 'tool-timer') {
        const st = this.state || {};
        if (!st.toolPaused) this.setState({ toolIdx: ((st.toolIdx || 0) + 1) % 3 });
        return;
      }
      if (e.animationName === 'tech-timer' && e.target.closest && e.target.closest('.stack')) {
        const st = this.state || {};
        if (!st.stackPaused) this.setState({ stackIdx: ((st.stackIdx || 0) + 1) % 9 });
        return;
      }
      if (e.animationName === 'tech-timer') {
        const st = this.state || {};
        if (!st.techPaused) this.setState({ techIdx: ((st.techIdx || 0) + 1) % 6 });
        return;
      }
      if (e.animationName !== 'pager-fill') return;
      const pager = e.target.closest && e.target.closest('.pager');
      if (!pager) return;
      const st = this.state || {};
      if (pager.dataset.slider === 'b') { if (!st.autoPausedB) this.setState({ slideB: ((st.slideB || 0) + 1) % 3 }); }
      else if (!st.autoPaused) this.setState({ slide: ((st.slide || 0) + 1) % 3 });
    };
    document.addEventListener('animationend', this._onFill);
    requestAnimationFrame(() => this.initMotion());
  }
  componentWillUnmount() {
    document.removeEventListener('animationend', this._onFill);
    try { if (this._lenis) this._lenis.destroy(); if (window.ScrollTrigger) window.ScrollTrigger.getAll().forEach((t) => t.kill()); } catch (e) {}
  }
  initFloatNav(root, ST) {
    const bar = root.querySelector('.float-nav'); if (!bar) return;
    const head = root.querySelector('.site-header');
    const ind = bar.querySelector('.float-ind');
    const cur = bar.querySelector('.float-current');
    const links = Array.from(bar.querySelectorAll('.float-links a'));
    const show = (on) => {
      bar.classList.toggle('is-visible', on);
      if (on) { bar.removeAttribute('inert'); bar.removeAttribute('aria-hidden'); }
      else { bar.setAttribute('inert', ''); bar.setAttribute('aria-hidden', 'true'); }
    };
    ST.create({ trigger: head, start: 'bottom top', end: 'max', onToggle: (self) => show(self.isActive) });
    const setActive = (id) => {
      let found = null;
      links.forEach((a) => { const on = a.getAttribute('data-target') === id; if (on) { a.setAttribute('aria-current', 'true'); found = a; } else { a.removeAttribute('aria-current'); } a.style.color = on ? 'var(--text-primary)' : ''; });
      if (found && ind) { ind.style.opacity = '1'; ind.style.transform = 'translateX(' + found.offsetLeft + 'px)'; ind.style.inlineSize = found.offsetWidth + 'px'; }
      else if (ind) { ind.style.opacity = '0'; }
      if (cur) cur.textContent = found ? found.textContent : '';
    };
    links.forEach((a) => {
      const sec = root.querySelector('#' + a.getAttribute('data-target'));
      if (!sec) return;
      ST.create({ trigger: sec, start: 'top 45%', end: 'bottom 45%', onToggle: (self) => { if (self.isActive) setActive(a.getAttribute('data-target')); } });
    });
    const contact = root.querySelector('#contact');
    if (contact) ST.create({ trigger: contact, start: 'top 45%', end: 'bottom 45%', onToggle: (self) => { if (self.isActive) setActive('contact'); } });
    ST.create({ trigger: root.querySelector('main'), start: 'top top', end: 'bottom 45%', onToggle: (self) => { if (self.isActive) setActive(null); } });
    window.addEventListener('resize', () => { const a = bar.querySelector('.float-links a[aria-current="true"]'); if (a) setActive(a.getAttribute('data-target')); });
  }
  initMotion() {
    const g = window.gsap, ST = window.ScrollTrigger, Split = window.SplitText;
    if (!g || !ST) { this._tries = (this._tries || 0) + 1; if (this._tries < 40) setTimeout(() => this.initMotion(), 100); return; }
    if (this._motionReady) return;
    this._motionReady = true;
    g.registerPlugin(ST); if (Split) g.registerPlugin(Split);
    const root = document.querySelector('.lbaf-root'); if (!root) return;
    const reduce = this._reduce;
    const ease = 'expo.out';
    const FADE = 0.25;
    if (!reduce && window.Lenis) {
      const lenis = new window.Lenis({ lerp: 0.1, anchors: { offset: -88 } });
      lenis.on('scroll', ST.update);
      g.ticker.add((t) => lenis.raf(t * 1000));
      g.ticker.lagSmoothing(0);
      this._lenis = lenis;
    }
    this.initFloatNav(root, ST);
    const titles = Array.from(root.querySelectorAll('h1, h2'));
    let entered = false;
    const runTitles = () => {
      titles.forEach((el) => {
        const hero = el.tagName === 'H1';
        if (hero && !reduce && Split && !entered) { this._heroQueue = () => make(el, hero); return; }
        make(el, hero);
      });
      g.set(titles, { visibility: 'visible' });
    };
    const make = (el, hero) => {
      {
        const st = hero ? undefined : { trigger: el, start: 'top 85%', once: true };
        if (reduce || !Split) { g.fromTo(el, { opacity: 0 }, { opacity: 1, duration: FADE, scrollTrigger: st, clearProps: 'opacity' }); return; }
        const split = Split.create(el, { type: 'lines', linesClass: 'line' });
        const tl = g.timeline({ scrollTrigger: st, delay: hero ? 0.15 : 0, onComplete: () => { split.revert(); } });
        tl.from(split.lines, { opacity: 0, y: 14, filter: 'blur(8px)', duration: 1.1, stagger: 0.07, ease: 'power3.out' });
        const hls = el.querySelectorAll('.hl');
        if (hls.length) tl.fromTo(hls, { '--hl': 0 }, { '--hl': 1, duration: 0.6, ease: 'power3.out' }, '-=0.35');
        if (hero) setTimeout(() => { if (tl.progress() < 1) tl.progress(1); }, 2200);
      }
    };
    g.set(titles, { visibility: 'hidden' });
    const fam = getComputedStyle(titles[0] || root).fontFamily;
    const fontsReady = (document.fonts && document.fonts.load)
      ? Promise.all([document.fonts.load('400 1em ' + fam), document.fonts.load('500 1em ' + fam)]).then(() => document.fonts.ready)
      : Promise.resolve();
    let started = false;
    const start = () => { if (started) return; started = true; runTitles(); ST.refresh(); };
    fontsReady.then(start, start);
    setTimeout(start, 1200);
    // Chorégraphie : en-tête, puis titre, texte, médias ; dans chaque section, surtitre, titre, texte, puis cartes décalées.
    const tracked = [];
    const CLR = 'filter,transform';
    const show = (els, vars) => {
      const list = (!els ? [] : (els instanceof Element ? [els] : Array.from(els))).filter(Boolean);
      if (!list.length) return null;
      tracked.push(...list);
      const v = Object.assign({}, vars || {});
      if (reduce) return g.from(list, { opacity: 0, duration: FADE, delay: v.delay ? Math.min(v.delay, 0.3) : 0, stagger: v.stagger ? 0.05 : 0, scrollTrigger: v.scrollTrigger });
      return g.from(list, Object.assign({ opacity: 0, y: 14, filter: 'blur(6px)', duration: 0.9, ease: 'power3.out', clearProps: CLR }, v));
    };
    const onEnter = (el, start) => ({ trigger: el, start: start || 'top 86%', once: true });

    // Logo animé (port de lbaLogoIntro.ts, Claude Motion) : le point jaune saute sur le haut des lettres et se pose en point final
    const logoMotion = (svg) => {
      const R = 4.9, REST = { x: 324.8, y: 46.33 };
      const top = (x, surface) => ({ x, y: surface - R });
      const STONE = { start: { x: -30, y: -34 }, l: top(6, 8.54), b: top(50, 8.54), A: top(91, 8.54), a: top(173.3, 20.74), o: top(256.6, 20.74) };
      const HEAVY = ['l', 'b', 'A'];
      const LIGHT = [['slash', 1.28], ['f', 1.36], ['a', 1.44], ['c', 1.56], ['t', 1.64], ['o', 1.72], ['r', 2.12], ['y', 2.22]];
      const ids = HEAVY.concat(LIGHT.map((l) => l[0]));
      const group = (id) => svg.querySelector('[data-g="' + id + '"]');
      const shape = (id) => svg.querySelector('[data-g="' + id + '"] > path');
      const dot = svg.querySelector('[data-g="dot"]');
      const disc = dot.querySelector('circle');
      const all = ids.map(group).concat(ids.map(shape), [dot, disc]);
      // Flou de mouvement : flou gaussien orienté selon la vitesse du point (x et y séparés)
      const NS = 'http://www.w3.org/2000/svg';
      const fid = 'lbaf-mb-' + Math.random().toString(36).slice(2, 8);
      const defs = document.createElementNS(NS, 'defs');
      const flt = document.createElementNS(NS, 'filter');
      const blur = document.createElementNS(NS, 'feGaussianBlur');
      flt.setAttribute('id', fid);
      [['x', '-150%'], ['y', '-150%'], ['width', '400%'], ['height', '400%'], ['color-interpolation-filters', 'sRGB']].forEach(([k, v]) => flt.setAttribute(k, v));
      blur.setAttribute('in', 'SourceGraphic');
      blur.setAttribute('stdDeviation', '0 0');
      flt.appendChild(blur); defs.appendChild(flt); svg.insertBefore(defs, svg.firstChild);
      let px = null, py = null, pt = 0, bx = 0, by = 0;
      const blurOff = () => { dot.removeAttribute('filter'); blur.setAttribute('stdDeviation', '0 0'); px = py = null; bx = by = 0; };
      const blurTick = () => {
        const x = +g.getProperty(dot, 'x'), y = +g.getProperty(dot, 'y'), t = performance.now();
        if (px !== null) {
          const k = 16.7 / Math.max(8, t - pt); // displacement per 60 fps frame, logo units
          const tx = Math.min(6, Math.abs(x - px) * k * 0.85), ty = Math.min(7, Math.abs(y - py) * k * 0.85);
          bx += (tx - bx) * 0.6; by += (ty - by) * 0.6;
          blur.setAttribute('stdDeviation', bx.toFixed(2) + ' ' + by.toFixed(2));
        }
        px = x; py = y; pt = t;
      };
      // cubic-bezier(0.16, 1, 0.3, 1)
      const bez = (x1, y1, x2, y2) => (t) => {
        let u = t; for (let i = 0; i < 8; i++) { const x = 3 * (1 - u) * (1 - u) * u * x1 + 3 * (1 - u) * u * u * x2 + u * u * u - t; const dx = 3 * (1 - u) * (1 - u) * x1 + 6 * (1 - u) * u * (x2 - x1) + 3 * u * u * (1 - x2); if (Math.abs(x) < 1e-5 || !dx) break; u -= x / dx; }
        return 3 * (1 - u) * (1 - u) * u * y1 + 3 * (1 - u) * u * u * y2 + u * u * u;
      };
      const ease = bez(0.16, 1, 0.3, 1);
      // Flou de mouvement des lettres : un filtre par lettre, son intensité retombe pendant l'entrée
      const gBlur = {};
      ids.forEach((id) => {
        const f = document.createElementNS(NS, 'filter'), fe = document.createElementNS(NS, 'feGaussianBlur');
        f.setAttribute('id', fid + '-' + id);
        [['x', '-40%'], ['y', '-40%'], ['width', '180%'], ['height', '180%']].forEach(([k, v]) => f.setAttribute(k, v));
        fe.setAttribute('stdDeviation', '0 0'); f.appendChild(fe); defs.appendChild(f); gBlur[id] = fe;
      });
      const glyphBlurOff = () => ids.forEach((id) => { group(id).removeAttribute('filter'); gBlur[id].setAttribute('stdDeviation', '0 0'); });
      const blurIn = (id, t0, sx, sy, dur) => {
        const o = { x: sx, y: sy }, fe = gBlur[id];
        tl.call(() => group(id).setAttribute('filter', 'url(#' + fid + '-' + id + ')'), null, t0)
          .fromTo(o, { x: sx, y: sy }, { x: 0, y: 0, duration: dur, ease: 'power2.out', onUpdate: () => fe.setAttribute('stdDeviation', o.x.toFixed(2) + ' ' + o.y.toFixed(2)), onComplete: () => group(id).removeAttribute('filter') }, t0);
      };
      let tl = null;
      const final = () => { if (tl) { tl.kill(); tl = null; } blurOff(); glyphBlurOff(); g.set(all, { clearProps: 'transform,opacity' }); };
      const hide = () => { final(); g.set(ids.map(group).concat([dot]), { opacity: 0 }); };
      const play = (delay, onDone) => {
        final();
        const m = 1;
        tl = g.timeline({ delay: delay || 0, onStart: () => dot.setAttribute('filter', 'url(#' + fid + ')'), onUpdate: blurTick, onComplete: () => { blurOff(); if (onDone) onDone(); } });
        g.set(ids.map(group), { opacity: 0, transformOrigin: '50% 100%' });
        g.set(ids.map(shape).concat([disc]), { transformOrigin: '50% 100%' });
        g.set(dot, { opacity: 0, x: STONE.start.x - REST.x, y: STONE.start.y - REST.y });
        HEAVY.forEach((id, i) => {
          const t0 = 0.1 * i;
          blurIn(id, t0, 0.3, 2.6, 0.38);
          tl.to(group(id), { opacity: 1, duration: 0.24, ease: 'power1.out' }, t0)
            .fromTo(group(id), { y: -18 * m }, { y: 0, duration: 0.34, ease: 'power2.in' }, t0)
            .to(shape(id), { scaleY: 1 - 0.05 * m, scaleX: 1 + 0.02 * m, duration: 0.06, ease: 'power2.out' }, t0 + 0.34)
            .to(shape(id), { scaleY: 1, scaleX: 1, duration: 0.3, ease }, t0 + 0.4);
        });
        LIGHT.forEach(([id, t0]) => {
          const spin = id === 'slash';
          blurIn(id, t0, spin ? 2.2 : 1.4, spin ? 2.2 : 1.8, 0.36);
          tl.fromTo(group(id), { opacity: 0, scale: 1 - 0.6 * m, y: (spin ? -10 : 6) * m, rotation: spin ? -25 * m : 0 },
            { opacity: 1, scale: 1, y: 0, rotation: 0, duration: 0.42, ease: 'back.out(1.4)' }, t0);
        });
        let y = STONE.start.y;
        const hop = (t0, to, h, dur, hang) => {
          const peak = Math.min(y, to.y) - h * m, up = dur * (hang ? 0.6 : 0.5), down = dur - up;
          tl.to(dot, { x: to.x - REST.x, duration: dur, ease: 'none' }, t0)
            .to(dot, { y: peak - REST.y, duration: up, ease: hang ? 'sine.out' : 'power2.out' }, t0)
            .to(dot, { y: to.y - REST.y, duration: down, ease: 'power2.in' }, t0 + up)
            .to(disc, { scaleY: 1 + 0.12 * m, scaleX: 1 - 0.06 * m, duration: down * 0.6, ease: 'power1.in' }, t0 + up + down * 0.4)
            .to(disc, { scaleY: 1 - 0.3 * m, scaleX: 1 + 0.22 * m, duration: 0.06, ease: 'power2.out' }, t0 + dur)
            .to(disc, { scaleY: 1, scaleX: 1, duration: 0.15, ease: 'power2.out' }, t0 + dur + 0.06);
          y = to.y;
        };
        const impact = (t0, under, neighbours, heavy) => {
          if (under) {
            const k = (heavy ? 0.04 : 0.08) * m;
            tl.to(shape(under), { scaleY: 1 - k, scaleX: 1 + k * 0.4, duration: 0.07, ease: 'power2.out' }, t0)
              .to(shape(under), { scaleY: 1, scaleX: 1, duration: 0.45, ease: 'elastic.out(1,0.45)' }, t0 + 0.07);
          }
          neighbours.forEach(([id, dir]) => {
            tl.to(shape(id), { rotation: dir * (heavy ? 1.2 : 2.4) * m, duration: 0.08, ease: 'power2.out' }, t0 + 0.02)
              .to(shape(id), { rotation: 0, duration: 0.6, ease: 'elastic.out(1,0.35)' }, t0 + 0.1);
          });
        };
        tl.to(dot, { opacity: 1, duration: 0.12, ease: 'power1.out' }, 0.48);
        hop(0.48, STONE.l, 6, 0.3); impact(0.78, 'l', [['b', 1]], true);
        hop(0.78, STONE.b, 10, 0.24); impact(1.02, 'b', [['l', -1], ['A', 1]], true);
        hop(1.02, STONE.A, 10, 0.26); impact(1.28, 'A', [['b', -1]], true);
        hop(1.28, STONE.a, 22, 0.38); impact(1.66, 'a', [['f', -1], ['c', 1]], false);
        hop(1.66, STONE.o, 16, 0.34); impact(2.0, 'o', [['t', -1], ['r', 1]], false);
        hop(2.0, REST, 34, 0.62, true); impact(2.62, null, [['y', -1.4], ['r', -0.6]], false);
        hop(2.62, REST, 3, 0.2);
        return tl;
      };
      return { play, hide, final, skip: () => { if (tl) tl.progress(1); final(); } };
    };
    // Intro : le logo s'anime (SVG), puis il vole jusqu'à l'en-tête pendant que la page apparaît
    const html = document.documentElement;
    const intro = root.querySelector('.intro');
    const vid = intro && intro.querySelector('svg.intro-logo');
    const useIntro = !reduce && !!vid && html.classList.contains('lbaf-intro');
    if (!useIntro) html.classList.remove('lbaf-intro');
    const entrance = () => {
      if (entered) return;
      entered = true;
      // En-tête
      const header = root.querySelector('.site-header');
      show(root.querySelectorAll((useIntro ? '' : '.site-header header > a, ') + '.site-header .nav li, .site-header .lang-wrap, .site-header .head-cta, .site-header .menu-btn'), { y: -8, filter: 'blur(4px)', duration: 0.8, stagger: 0.05, delay: 0.05 });
      if (!reduce) {
        // Filets tracés au défilement : sous la navigation, sur les côtés, entre les sections et les lignes
        // Au chargement : le filet de la navigation se trace en entier, les filets latéraux descendent jusqu'au bas de l'écran
        if (header) g.fromTo(header, { '--sl': 0 }, { '--sl': 1, duration: 1.8, ease: 'expo.inOut', delay: 0.1 });
        const sideLines = () => {
          const H = root.scrollHeight, vh = window.innerHeight, max = Math.max(1, H - vh);
          const s = Math.max(0, -root.getBoundingClientRect().top);
          const p = Math.min(1, s / max);
          return Math.min(1, (s + vh * (0.72 + 0.28 * p)) / H);
        };
        const vl = { v: 0 };
        let introDone = false;
        const paintVl = () => root.style.setProperty('--vl', vl.v.toFixed(4));
        paintVl();
        g.to(vl, { v: () => sideLines(), duration: 2, ease: 'expo.inOut', delay: 0.25, onUpdate: paintVl, onComplete: () => { introDone = true; if (setVl) setVl(sideLines()); } });
        const setVl = g.quickTo ? g.quickTo(vl, 'v', { duration: 0.6, ease: 'power3.out', onUpdate: () => root.style.setProperty('--vl', vl.v.toFixed(4)) }) : null;
        ST.create({ trigger: root, start: 'top top', end: 'bottom bottom', onUpdate: () => { if (!introDone) return; if (setVl) setVl(sideLines()); else { vl.v = sideLines(); paintVl(); } }, onRefresh: () => { if (!introDone) return; vl.v = sideLines(); paintVl(); } });
      }
      // Hero
      const heroMain = root.querySelector('main');
      const textCol = heroMain && heroMain.children[0];
      const mediaCol = heroMain && heroMain.children[1];
      const heroText = root.querySelectorAll('main > div:first-child > p, main > div:first-child > div');
      show(heroText, { delay: 0.55, stagger: 0.12 });
      if (mediaCol) {
        const tiles = Array.from(mediaCol.querySelectorAll(':scope > .squircle'));
        show(tiles[0], { y: 28, scale: 0.97, filter: 'blur(12px)', duration: 1.4, ease: 'expo.out', delay: 0.3 });
        show(tiles.slice(1), { y: 32, filter: 'blur(10px)', duration: 1.3, ease: 'expo.out', delay: 0.55, stagger: 0.12 });
        if (!reduce) g.from(mediaCol.querySelectorAll('.squircle img:not(.slide)'), { scale: 1.12, duration: 1.8, ease, delay: 0.55, stagger: 0.12 });
        show(mediaCol.querySelector('.pager'), { y: 8, filter: 'blur(4px)', duration: 0.7, delay: 1.1 });
        show(mediaCol.querySelector('.meta'), { y: 6, duration: 0.7, delay: 1.3 });
        if (!reduce) {
          const sc = { trigger: heroMain, start: 'top top', end: 'bottom top', scrub: true };
          if (textCol) g.to(textCol, { yPercent: -10, ease: 'none', scrollTrigger: sc });
          g.to(mediaCol, { yPercent: -4, ease: 'none', scrollTrigger: sc });
        }
      }
      if (this._heroQueue) { const q = this._heroQueue; this._heroQueue = null; q(); }
      setTimeout(net, 2500);
    };
    if (useIntro) {
      const lenis = this._lenis;
      if (lenis) lenis.stop();
      html.style.overflow = 'hidden';
      let flown = false;
      const finish = () => {
        html.classList.remove('lbaf-intro');
        html.style.overflow = '';
        if (lenis) lenis.start();
        ST.refresh();
      };
      const lm = logoMotion(vid);
      const fly = () => {
        if (flown) return; flown = true;
        intro.style.pointerEvents = 'none';
        const img = root.querySelector('.site-header header > a img');
        entrance();
        if (!img) { g.to(intro, { opacity: 0, duration: 0.5, onComplete: finish }); return; }
        // Le SVG et le PNG de l'en-tête ont le même cadrage (330 × 63) : simple mise à l'échelle
        const vr = vid.getBoundingClientRect(), ir = img.getBoundingClientRect();
        const k = ir.width / vr.width;
        g.timeline({ onComplete: finish })
          .to(vid, { x: ir.left - vr.left, y: ir.top - vr.top, scale: k, duration: 1.05, ease: 'expo.inOut' }, 0)
          .to(intro, { backgroundColor: 'rgba(253,252,252,0)', duration: 0.8, ease: 'power2.inOut' }, 0.15);
      };
      const skip = () => { lm.skip(); fly(); };
      intro.addEventListener('click', skip);
      window.addEventListener('keydown', skip, { once: true });
      lm.play(0.25, () => g.delayedCall(0.35, fly));
    } else {
      entrance();
    }
    // Têtes de section : surtitre avant le titre, texte d'accompagnement après
    root.querySelectorAll('.surtitre').forEach((el) => show(el, { y: 10, duration: 0.8, scrollTrigger: onEnter(el, 'top 88%') }));
    root.querySelectorAll('.sec-head > p:not(.surtitre), #agence h2 + p, #contact h2 + p').forEach((el) => {
      const h = el.parentElement.querySelector('h2') || el;
      show(el, { delay: 0.35, scrollTrigger: onEnter(h, 'top 85%') });
    });
    // Filets et panneaux
    if (!reduce) {
      root.querySelectorAll('#solutions, #expertises, #references, #recrutement').forEach((sec) => {
        g.fromTo(sec, { '--sl': 0 }, { '--sl': 1, ease: 'none', scrollTrigger: { trigger: sec, start: 'top 98%', end: 'top 42%', scrub: 0.6 } });
      });
      root.querySelectorAll('#agence, #contact').forEach((sec) => {
        g.fromTo(sec, { '--bgx': 0.9, '--bgy': 0.96, '--bgr': 48 }, { '--bgx': 1, '--bgy': 1, '--bgr': 0, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'top 25%', scrub: true } });
      });
    }
    // Cartes et images : chaque tuile entre avec un léger décalage, puis son contenu
    const tiles = Array.from(root.querySelectorAll('#solutions .card, #expertises .exp-card, #references .card, #recrutement .card, #recrutement figure, #agence figure'));
    const kidsOf = (t) => t.matches('figure') ? [] : Array.from(t.querySelectorAll(':scope > p, :scope > div:not([role]) > :not(svg):not(.illu-zoom), :scope > div[role="img"]'));
    tracked.push(...tiles);
    g.set(tiles, reduce ? { opacity: 0 } : { opacity: 0, y: 48, filter: 'blur(10px)' });
    ST.batch(tiles, {
      start: 'top 88%', once: true,
      onEnter: (batch) => batch.forEach((t, i) => {
        if (reduce) { g.to(t, { opacity: 1, duration: FADE, delay: i * 0.05 }); return; }
        const tl = g.timeline({ delay: i * 0.14 });
        tl.to(t, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'expo.out', clearProps: CLR });
        const img = t.matches('figure') && t.querySelector(':scope > img');
        if (img) tl.from(img, { scale: 1.16, duration: 1.8, ease, clearProps: 'transform' }, 0);
        const kids = kidsOf(t);
        if (kids.length) tl.from(kids, { opacity: 0, y: 12, filter: 'blur(4px)', duration: 0.8, stagger: 0.07, ease: 'power3.out', clearProps: CLR }, 0.2);
      })
    });
    // Lignes (expertises, offres) : le filet se trace, puis le contenu de la ligne
    const rows = Array.from(root.querySelectorAll('.rows > li'));
    tracked.push(...rows);
    g.set(rows, { opacity: 0 });
    if (!reduce) root.querySelectorAll('.rows > li + li').forEach((li) => g.fromTo(li, { '--line': 0 }, { '--line': 1, ease: 'none', scrollTrigger: { trigger: li, start: 'top 96%', end: 'top 60%', scrub: 0.6 } }));
    ST.batch(rows, {
      start: 'top 90%', once: true,
      onEnter: (batch) => batch.forEach((li, i) => {
        if (reduce) { g.to(li, { opacity: 1, duration: FADE }); return; }
        const tl = g.timeline({ delay: i * 0.12 });
        tl.set(li, { opacity: 1 });
        tl.from(li.children, { opacity: 0, y: 14, filter: 'blur(5px)', duration: 0.85, stagger: 0.07, ease: 'power3.out', clearProps: CLR }, 0.15);
      })
    });
    // L'agence et contact : lignes de chiffres et coordonnées en cascade
    root.querySelectorAll('#agence dl, #contact dl').forEach((dl) => show(dl.children, { stagger: 0.12, delay: 0.15, scrollTrigger: onEnter(dl, 'top 88%') }));
    const form = root.querySelector('#contact form');
    if (form) {
      show(form, { y: 48, filter: 'blur(10px)', duration: 1.2, ease: 'expo.out', scrollTrigger: onEnter(form, 'top 85%') });
      show(form.children, { y: 12, filter: 'blur(4px)', duration: 0.8, stagger: 0.06, delay: 0.25, scrollTrigger: onEnter(form, 'top 85%') });
    }
    show(root.querySelectorAll('footer .foot > *'), { y: 10, stagger: 0.08, scrollTrigger: onEnter(root.querySelector('footer'), 'top 95%') });
    if (!reduce) {
      const img = root.querySelector('.parallax-img');
      if (img) g.fromTo(img, { yPercent: -5, scale: 1.12 }, { yPercent: 5, scale: 1.12, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
      root.querySelectorAll('.count').forEach((el) => {
        const node = el.firstChild; const to = parseInt(el.getAttribute('data-to'), 10) || 0; const o = { v: 0 };
        node.nodeValue = '0';
        g.to(o, { v: to, duration: 1.4, delay: 0.3, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true }, onUpdate: () => { node.nodeValue = String(Math.round(o.v)); } });
      });
    }
    // Pied de page en rideau : contenu qui remonte, logo qui se déplie, liés au défilement
    const footEd = root.querySelector('.foot-ed');
    if (footEd) {
      // Les filets latéraux s'arrêtent au-dessus du pied de page
      const setFootH = () => root.style.setProperty('--foot-h', footEd.offsetHeight + 'px');
      setFootH(); window.addEventListener('resize', setFootH);
    }
    if (footEd && !reduce) {
      const prev = footEd.previousElementSibling;
      const range = () => '+=' + footEd.offsetHeight;
      g.fromTo(footEd.querySelector('.foot-inner'), { yPercent: -18 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: prev, start: 'bottom bottom', end: range, scrub: true, invalidateOnRefresh: true } });
      // Le logo s'anime un court instant après l'ouverture du rideau ; il se réinitialise si l'on remonte
      const flSvg = footEd.querySelector('.foot-logo');
      if (flSvg) {
        const fm = logoMotion(flSvg);
        fm.hide();
        let played = false, timer = null;
        ST.create({ trigger: prev, start: 'bottom bottom', end: range, invalidateOnRefresh: true, onUpdate: (self) => {
          if (self.progress > 0.75 && !played) { played = true; timer = setTimeout(() => fm.play(0), 250); }
          else if (self.progress < 0.15 && played) { played = false; clearTimeout(timer); fm.hide(); }
        } });
        setTimeout(() => { const r = flSvg.getBoundingClientRect(); if (!played && r.top < innerHeight && r.bottom > 0) { played = true; fm.play(0); } }, 2500);
      }
    }
    root.querySelectorAll('.map').forEach((m) => ST.create({ trigger: m, start: 'top 85%', once: true, onEnter: () => g.delayedCall(reduce ? 0 : 0.5, () => m.classList.add('is-in')) }));
    setTimeout(() => root.querySelectorAll('.map').forEach((m) => { const r = m.getBoundingClientRect(); if (r.top < window.innerHeight) m.classList.add('is-in'); }), 2000);
    // Illustrations pilotées par le défilement : chaque carte se construit en descendant
    if (!reduce) {
      const LOOP = ['x-blink', 'x-meridian', 'e-orbit', 'x-stream', 'x-rise', 'x-core', 'x-node', 'e-wave', 'a-flow'];
      root.querySelectorAll('#solutions .card, #solutions .sol-row, #expertises .exp-card').forEach((card) => {
        const anims = (card.getAnimations ? card.getAnimations({ subtree: true }) : []).filter((a) => a.animationName && a.effect && a.effect.target && a.effect.target.closest && a.effect.target.closest('svg.illu'));
        if (!anims.length) return;
        anims.forEach((a) => a.pause());
        // Moment de l'animation où chaque élément est à son amplitude maximale
        const PEAK = { 'x-type': 0.6, 'x-up': 0.52, 'x-down': 0.52, 'e-draw': 0.6, 'x-grow': 0.7, 'e-fill': 0.7, 'e-cur': 0.62, 'x-layer': 0.52, 'x-ripple': 0.5, 'x-out': 0.74, 'x-pop': 0.78, 'x-scan': 0.5 };
        const apply = (p) => anims.forEach((a) => {
          const t = a.effect.getTiming();
          const dur = typeof t.duration === 'number' ? t.duration : 0;
          const name = a.animationName;
          if (LOOP.indexOf(name) > -1) { a.currentTime = p * dur * 3; return; }
          const peak = PEAK[name] || 0.6;
          a.currentTime = Math.min(p / 0.85, 1) * dur * peak;
        });
        apply(0);
        // Survol : l'illustration joue en boucle, puis revient en douceur à l'état lié au défilement
        let hovering = false, progress = 0, back = null;
        const st = ST.create({ trigger: card, start: 'top bottom', end: 'bottom 30%', scrub: 1, onUpdate: (self) => { progress = self.progress; if (!hovering && !back) apply(progress); }, onRefresh: (self) => { progress = self.progress; if (!hovering) apply(progress); } });
        card.addEventListener('pointerenter', (e) => {
          if (e.pointerType !== 'mouse') return;
          hovering = true; if (back) { back.kill(); back = null; }
          anims.forEach((a) => { a.playbackRate = 1; a.play(); });
        });
        card.addEventListener('pointerleave', (e) => {
          if (e.pointerType !== 'mouse') return;
          hovering = false;
          anims.forEach((a) => a.pause());
          const from = anims.map((a) => a.currentTime || 0);
          apply(progress);
          const to = anims.map((a) => a.currentTime || 0);
          anims.forEach((a, i) => { a.currentTime = from[i]; });
          const k = { t: 0 };
          back = g.to(k, { t: 1, duration: 0.7, ease: 'power3.out', onUpdate: () => anims.forEach((a, i) => { a.currentTime = from[i] + (to[i] - from[i]) * k.t; }), onComplete: () => { back = null; apply(progress); } });
        });
        const svg = card.querySelector('.illu');
        if (svg) g.fromTo(svg, { scale: 0.8, yPercent: 10, rotate: -3 }, { scale: 1, yPercent: 0, rotate: 0, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 35%', scrub: 1 } });
      });
    }
    // Filet de sécurité : rien ne doit rester invisible dans la fenêtre
    function net() {
      tracked.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0 && parseFloat(getComputedStyle(el).opacity) < 0.05) g.set(el, { opacity: 1, y: 0, filter: 'none', '--line': 1 });
      });
    }
  }
}

new App();
