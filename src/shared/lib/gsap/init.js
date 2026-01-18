import gsap from "gsap";
import MotionPathPlugin from "gsap/MotionPathPlugin";
import LocalTimeline from "./LocalTimeline";

gsap.registerPlugin(MotionPathPlugin);
gsap.localTimeline = new LocalTimeline();