## Concepts in the ZinZen&reg; scheduling algorithm
To create a ubiquitous language for talking about the algorithm, all concepts used in the algorithm are defined below.

### 1) Goals
A goal is the most important concept in ZinZen&reg;. A goal is a description of something 
you want to get done, like 'walk 4 hours'. Goals come from the frontend/UI and are specified by the user.

Goals can be modified with restrictions and repeats, like 'walk 4 hours every week between 6p.m. and 10p.m from Sep. 1st until Oct. 1st'

### 2) Tasks  
Tasks are only relevant once _all_ scheduling is done. A Task is something you'll see on the final calendar and represent time you will spend on working towards achieving a certain goal.  

### 3) Budget
A budget is a minimum number of hours _required_ to be spent in a given timeframe on a goal, and a maximum number of hours _if possible_ for that same timeframe. A timeframe can currently be a day or a week.

Example:  
On goal 'learn Spanish' I want to spend a minimum of 4 hours and a maximum of 8 hours every week, but max of 2h per day - as it's quite intensive and you can't keep it up for very long.
This is represented as a budget with:
* 4h-6h / week
* max 2h / day

### 4) Filter
A filter is a restriction on the time that is suitable to work on a goal. 'Weekdays' could be a filter. Another filter is '6-18' for filtering on the time of day. This doesn't mean the goal will actually use all of the days and times defined by the filters - it just says anything outside these boundaries can't be used.