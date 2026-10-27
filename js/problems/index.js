import { AnagramsProblem } from "./anagrams.js";
import { AutocompleteProblem } from "./autocomplete.js";
import { BalancedProblem } from "./balanced.js";
import { BeltProblem } from "./belt.js";
import { BfsProblem } from "./bfs.js";
import { BigRoutesProblem } from "./bigroutes.js";
import { BipartiteProblem } from "./bipartite.js";
import { BracketsProblem } from "./brackets.js";
import { BridgesProblem } from "./bridges.js";
import { BstProblem } from "./bst.js";
import { BuildProblem } from "./build.js";
import { BurstProblem } from "./burst.js";
import { CalcProblem } from "./calc.js";
import { CalcParenProblem } from "./calcparen.js";
import { CoinsProblem } from "./coins.js";
import { CollectProblem } from "./collect.js";
import { CombosProblem } from "./combos.js";
import { CooldownProblem } from "./cooldown.js";
import { DeadlockProblem } from "./deadlock.js";
import { DecodeProblem } from "./decode.js";
import { DepthProblem } from "./depth.js";
import { DiameterProblem } from "./diameter.js";
import { DocksProblem } from "./docks.js";
import { EditProblem } from "./edit.js";
import { ExitsProblem } from "./exits.js";
import { FuelProblem } from "./fuel.js";
import { HistogramProblem } from "./histogram.js";
import { HitCounterProblem } from "./hitcounter.js";
import { InversionsProblem } from "./inversions.js";
import { IslandProblem } from "./island.js";
import { IsomorphProblem } from "./isomorph.js";
import { ItineraryProblem } from "./itinerary.js";
import { JumpProblem } from "./jump.js";
import { JustifyProblem } from "./justify.js";
import { KadaneProblem } from "./kadane.js";
import { KnapsackProblem } from "./knapsack.js";
import { KnockProblem } from "./knock.js";
import { KStopsProblem } from "./kstops.js";
import { KthProblem } from "./kth.js";
import { KthLargestProblem } from "./kthlargest.js";
import { LadderProblem } from "./ladder.js";
import { LargestProblem } from "./largest.js";
import { LcaProblem } from "./lca.js";
import { LcaTreeProblem } from "./lcatree.js";
import { LcsProblem } from "./lcs.js";
import { LeakProblem } from "./leak.js";
import { LevelsProblem } from "./levels.js";
import { LfuProblem } from "./lfu.js";
import { LifeProblem } from "./life.js";
import { LisProblem } from "./lis.js";
import { LongPalProblem } from "./longpal.js";
import { LookupProblem } from "./lookup.js";
import { LoopProblem } from "./loop.js";
import { LoopStartProblem } from "./loopstart.js";
import { LruProblem } from "./lru.js";
import { MedianProblem } from "./median.js";
import { Median2Problem } from "./median2.js";
import { MergeProblem } from "./merge.js";
import { MergeKProblem } from "./mergek.js";
import { MergeTwoProblem } from "./mergetwo.js";
import { MinStackProblem } from "./minstack.js";
import { MstProblem } from "./mst.js";
import { NestedProblem } from "./nested.js";
import { NextProblem } from "./next.js";
import { NthEndProblem } from "./nthend.js";
import { OverlapProblem } from "./overlap.js";
import { OverlapsProblem } from "./overlaps.js";
import { PackProblem } from "./pack.js";
import { PacksProblem } from "./packs.js";
import { PairProblem } from "./pair.js";
import { PalindromeProblem } from "./palindrome.js";
import { ParensProblem } from "./parens.js";
import { PartitionProblem } from "./partition.js";
import { PathSumProblem } from "./pathsum.js";
import { PatternProblem } from "./pattern.js";
import { PeekingProblem } from "./peeking.js";
import { PermsProblem } from "./perms.js";
import { PickListProblem } from "./picklist.js";
import { PowModProblem } from "./powmod.js";
import { PrefixesProblem } from "./prefixes.js";
import { PrimesProblem } from "./primes.js";
import { QueensProblem } from "./queens.js";
import { RainProblem } from "./rain.js";
import { RandSetProblem } from "./randset.js";
import { RangesProblem } from "./ranges.js";
import { RangeSumProblem } from "./rangesum.js";
import { RedundantProblem } from "./redundant.js";
import { ReorderProblem } from "./reorder.js";
import { ReverseProblem } from "./reverse.js";
import { RightViewProblem } from "./rightview.js";
import { RleProblem } from "./rle.js";
import { RobberProblem } from "./robber.js";
import { RotateProblem } from "./rotate.js";
import { RotatedProblem } from "./rotated.js";
import { RoutesProblem } from "./routes.js";
import { SimplifyProblem } from "./simplify.js";
import { SingleProblem } from "./single.js";
import { SkylineProblem } from "./skyline.js";
import { SnapshotProblem } from "./snapshot.js";
import { SortColorsProblem } from "./sortcolors.js";
import { SpeedProblem } from "./speed.js";
import { SpiralProblem } from "./spiral.js";
import { SqrtProblem } from "./sqrt.js";
import { StockProblem } from "./stock.js";
import { SubarrayProblem } from "./subarray.js";
import { SubsetsProblem } from "./subsets.js";
import { SudokuProblem } from "./sudoku.js";
import { TimeKvProblem } from "./timekv.js";
import { TopKProblem } from "./topk.js";
import { TopoProblem } from "./topo.js";
import { TreeRobProblem } from "./treerob.js";
import { UniqueProblem } from "./unique.js";
import { WetProblem } from "./wet.js";
import { WindowProblem } from "./window.js";
import { WordBreakProblem } from "./wordbreak.js";
import { WordGridProblem } from "./wordgrid.js";
import { WordSearchProblem } from "./wordsearch.js";

// Every problem, grouped by level. Within a level they're ordered by topic (see TOPICS).
export const PROBLEMS = [
  // L1: 15
  PairProblem, RangesProblem, PalindromeProblem, BracketsProblem, TopKProblem, LookupProblem, SqrtProblem, ReverseProblem, DepthProblem, BfsProblem, IslandProblem, SubsetsProblem, RleProblem, SingleProblem, PacksProblem,
  // L2: 28
  AnagramsProblem, IsomorphProblem, BeltProblem, NextProblem, SimplifyProblem, SortColorsProblem, LargestProblem, MergeProblem, LoopProblem, MergeTwoProblem, NthEndProblem, LevelsProblem, RightViewProblem, BalancedProblem, LeakProblem, RoutesProblem, RobberProblem, KadaneProblem, CombosProblem, PermsProblem, JumpProblem, PickListProblem, DocksProblem, PrimesProblem, OverlapProblem, SpiralProblem, RotateProblem, MinStackProblem,
  // L3: 28
  SubarrayProblem, UniqueProblem, CalcProblem, DecodeProblem, KthLargestProblem, RotatedProblem, SpeedProblem, LoopStartProblem, BstProblem, KthProblem, LcaProblem, DiameterProblem, ExitsProblem, BipartiteProblem, WetProblem, TopoProblem, LcsProblem, WordBreakProblem, ParensProblem, WordSearchProblem, OverlapsProblem, FuelProblem, LongPalProblem, BigRoutesProblem, PowModProblem, LifeProblem, HitCounterProblem, PeekingProblem,
  // L4: 27
  CooldownProblem, InversionsProblem, ReorderProblem, LcaTreeProblem, BuildProblem, TreeRobProblem, PrefixesProblem, AutocompleteProblem, KnockProblem, LadderProblem, KStopsProblem, DeadlockProblem, RedundantProblem, CoinsProblem, LisProblem, KnapsackProblem, PartitionProblem, StockProblem, PackProblem, QueensProblem, PatternProblem, JustifyProblem, LruProblem, RandSetProblem, NestedProblem, SnapshotProblem, TimeKvProblem,
  // L5: 19
  RainProblem, WindowProblem, HistogramProblem, CalcParenProblem, MedianProblem, Median2Problem, MergeKProblem, PathSumProblem, WordGridProblem, CollectProblem, BridgesProblem, ItineraryProblem, MstProblem, EditProblem, BurstProblem, SudokuProblem, SkylineProblem, LfuProblem, RangeSumProblem
];

// Topics for the problem bar's filter chips. Each problem id belongs to exactly one.
export const TOPICS = [
  {name: "Arrays & hashing", ids: "pair ranges anagrams isomorph subarray".split(" ")},
  {name: "Two pointers & windows", ids: "palindrome belt unique rain".split(" ")},
  {name: "Stacks", ids: "brackets next simplify calc decode window histogram calcparen".split(" ")},
  {name: "Heaps", ids: "topk kthlargest median cooldown".split(" ")},
  {name: "Sorting & searching", ids: "lookup sqrt sortcolors largest merge rotated speed inversions median2".split(" ")},
  {name: "Linked lists", ids: "reverse loop mergetwo nthend loopstart reorder mergek".split(" ")},
  {name: "Trees & tries", ids: "depth levels rightview balanced bst kth lca diameter lcatree build treerob prefixes autocomplete pathsum wordgrid".split(" ")},
  {name: "Graphs", ids: "grid islands leak exits bipartite wet topo knock ladder kstops deadlock redundant collect bridges itinerary mst".split(" ")},
  {name: "Dynamic programming", ids: "routes robber kadane lcs wordbreak coins lis knapsack partition stock edit burst".split(" ")},
  {name: "Backtracking", ids: "subsets combos perms parens wordsearch pack queens sudoku".split(" ")},
  {name: "Greedy & intervals", ids: "jump picklist docks overlaps fuel skyline".split(" ")},
  {name: "Strings", ids: "rle longpal pattern justify".split(" ")},
  {name: "Math & bits", ids: "single packs primes overlap bigroutes powmod".split(" ")},
  {name: "Simulation", ids: "spiral rotate life".split(" ")},
  {name: "Design", ids: "minstack hitcounter peeking lru randset nested snapshot timekv lfu rangesum".split(" ")}
];
const TOPIC_OF = new Map(TOPICS.flatMap(t => t.ids.map(id => [id, t.name])));
PROBLEMS.forEach(p => { p.topic = TOPIC_OF.get(p.id) || "Other"; });
