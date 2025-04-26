# Let's Breakdown on How the Algorithm Works
---
## The main steps are as follows:
> 1. Ask for the <ins>Allocation Matrix</ins>, the <ins>Max Requirement Matrix</ins>, and the <ins>Values of the Resources</ins>.
> 2. Calculate the <ins>Needs Matrix</ins> by subtracting the Allocation Matrix from the Max Requirement Matrix element-wise.
> 3. Calculate the <ins>Initial Available Resources</ins> by taking the sum of all the allocations, then subtracting from the Values of the Resources.
> 4. Compare the current available resources to the Needs table row-wise from top to bottom (this is by choice).
> 5. If each resource need is less than the available resource, note the process.
>> 6. Add the allocation of the noted process to the available resources, then return to step 4 and ignore the noted process/es.
>> 7. If all the processes have finished. Then the system is safe. [END]
> 6. Else, that would mean that the currently available resources cannot accomodate the unfinished process/es.
>> 7. Thus, a deadlock is detected. [END]

---

## Implementation

```Type
function BankersAlgorithm(allocation: number[][], max: number[][], resources: number[]) {
	const need = getNeed(allocation, max);
	let sequence: number[] = [];
	let available_sequence: number[][] = [];
	available_sequence.push(getAvailable(allocation, resources));
	const process_length = available_sequence[available_sequence.length - 1].length;
	for (let i = 0; i < need.length; i++) {
		let j = 0;
		if (!sequence.includes(i)) {
			for (j = 0; j < process_length; j++) {
				if (need[i][j] > available_sequence[available_sequence.length - 1][j]) {
					break;
				}
			}
			if (process_length === j) {
				sequence.push(i);
        let new_available = getNewAvailable(allocation[i],available_sequence[available_sequence.length - 1]);
        available_sequence.push(new_available);
				i = -1;
			}
		}
	}
	if (sequence.length !== allocation.length) {
		return { available_sequence, need: need, sequence: sequence, status: 2 };
	} else {
		return { available_sequence, need: need, sequence: sequence, status: 1 };
	}
}
```

We get the 3 inputs as parameters for the function and we try to find the Need Matrix and the Available Matrix.
Namely, `getNeed(allocation, max)` and `getAvailable(allocation, resources)`.
They are defined as follows:
```
const getNeed = (allocation: number[][], max: number[][]) => {
	let need: number[][] = [];
	for (let i = 0; i < allocation.length; i++) {
		need[i] = [];
		for (let j = 0; j < allocation[i].length; j++) {
			need[i][j] = max[i][j] - allocation[i][j];
		}
	}

	return need;
};
```
This is clearly seen to loop around the two matrices and subtracting it element-wise.
```
const getAvailable = (allocation: number[][], resources: number[]) => {
	let available: number[] = [];
	for (let i = 0; i < resources.length; i++) {
		let sum = 0;
		for (let j = 0; j < allocation.length; j++) {
			sum += allocation[j][i];
		}
		available[i] = resources[i] - sum;
	}
	return available;
};
```
In this function, we first sum all the allocations then subtract it to the resources.

Following the Algorithm, it will now enter the loop in checking the needs of each processes.
If any of the resources cannot be satisfied, then it breaks the loop. Else, the process is noted to the `sequence` and the available resources is then pushed and 
updated using the function `getNewAvailable(allocation: number[], resources: number[])` defined as follows:
```
const getNewAvailable = (allocation: number[], resources: number[]) => {
	let available: number[] = [];
	for (let i = 0; i < resources.length; i++) {
		available[i] = resources[i] + allocation[i];
	}
	return available;
};
```
Once updated, the loop hits a reset to again check all the processes with the new available resources.

At the end, the implementation will return either `status = 1` or `status = 2`. `1` signifies that the algorithm has found a safe sequence while `2`
signifies that the function ended prematurely. Thus, encountered a deadlock.  
