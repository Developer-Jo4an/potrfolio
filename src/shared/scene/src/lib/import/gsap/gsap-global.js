import gsap from "gsap";
import MotionPathPlugin from "gsap/MotionPathPlugin";
import {LocalTimeline} from "../../../../../lib";

global.gsap = gsap;
global.gsap.localTimeline = LocalTimeline.instance;
global.gsap.registerPlugin(MotionPathPlugin);
