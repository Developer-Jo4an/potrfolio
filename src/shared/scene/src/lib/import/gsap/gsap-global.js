import gsap from "gsap";
import MotionPathPlugin from "gsap/MotionPathPlugin";
import {LocalTimeline} from "../../../../../lib";

global.gsap = gsap;

gsap.localTimeline = LocalTimeline.instance;
gsap.registerPlugin(MotionPathPlugin);
