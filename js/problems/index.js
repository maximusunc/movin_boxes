import { AnagramsProblem } from "./anagrams.js";
import { BeltProblem } from "./belt.js";
import { BfsProblem } from "./bfs.js";
import { BracketsProblem } from "./brackets.js";
import { BstProblem } from "./bst.js";
import { BuildProblem } from "./build.js";
import { CoinsProblem } from "./coins.js";
import { DocksProblem } from "./docks.js";
import { EditProblem } from "./edit.js";
import { HistogramProblem } from "./histogram.js";
import { IslandProblem } from "./island.js";
import { JumpProblem } from "./jump.js";
import { KadaneProblem } from "./kadane.js";
import { KnockProblem } from "./knock.js";
import { LcaProblem } from "./lca.js";
import { LevelsProblem } from "./levels.js";
import { LookupProblem } from "./lookup.js";
import { LoopProblem } from "./loop.js";
import { LruProblem } from "./lru.js";
import { MedianProblem } from "./median.js";
import { MergeProblem } from "./merge.js";
import { MinStackProblem } from "./minstack.js";
import { MstProblem } from "./mst.js";
import { NextProblem } from "./next.js";
import { PackProblem } from "./pack.js";
import { PairProblem } from "./pair.js";
import { PalindromeProblem } from "./palindrome.js";
import { PrefixesProblem } from "./prefixes.js";
import { RainProblem } from "./rain.js";
import { RangesProblem } from "./ranges.js";
import { RedundantProblem } from "./redundant.js";
import { ReorderProblem } from "./reorder.js";
import { ReverseProblem } from "./reverse.js";
import { RotatedProblem } from "./rotated.js";
import { RoutesProblem } from "./routes.js";
import { SingleProblem } from "./single.js";
import { SpeedProblem } from "./speed.js";
import { SpiralProblem } from "./spiral.js";
import { SubarrayProblem } from "./subarray.js";
import { TopKProblem } from "./topk.js";
import { TopoProblem } from "./topo.js";
import { UniqueProblem } from "./unique.js";
import { WetProblem } from "./wet.js";
import { WindowProblem } from "./window.js";

export const PROBLEMS = [
  // L1
  BfsProblem, PairProblem, IslandProblem, TopKProblem, BracketsProblem, ReverseProblem, LookupProblem, PalindromeProblem, RangesProblem, SingleProblem,
  // L2
  BeltProblem, NextProblem, RoutesProblem, DocksProblem, MergeProblem, AnagramsProblem, LevelsProblem, KadaneProblem, JumpProblem, LoopProblem, MinStackProblem, SpiralProblem,
  // L3
  SpeedProblem, WetProblem, TopoProblem, BstProblem, SubarrayProblem, RotatedProblem, LcaProblem, UniqueProblem,
  // L4
  RedundantProblem, CoinsProblem, PrefixesProblem, PackProblem, ReorderProblem, KnockProblem, LruProblem, BuildProblem,
  // L5
  WindowProblem, RainProblem, HistogramProblem, EditProblem, MstProblem, MedianProblem
];
