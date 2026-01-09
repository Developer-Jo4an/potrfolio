import gsap from "gsap";

export default function clearHitTween(domNode, onComplete) {
  const timeline = gsap.timeline({onComplete});

  timeline
  .to(domNode, {opacity: 1, ease: "sine.inOut", duration: 0.2})
  .to(domNode, {scale: 1.3, ease: "none", duration: 0.3, repeat: 3, yoyo: true}, "<")
  .to(domNode, {opacity: 0, ease: "sine.inOut", duration: 0.2}, "-=0.2");

  return () => {
    timeline.kill();
    onComplete();
  };
}