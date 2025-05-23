// * This is the implementation of the Bankers' Algorithm
// * It takes the inputs of allocation, max, and available matrices as discussed in class
// * with this, the algorithm will check for deadlocks
export function BankersAlgorithm(allocation: number[][], max: number[][], resources: number[]) {
	console.log('Initial Allocation:');
	console.table(allocation);
	console.log('Maximum Requirement:');
	console.table(max);

	//! Calculate for the need matrix
	const need = getNeed(allocation, max);

	//! Initialize the final sequence and available sequence
	let sequence: number[] = [];
	let available_sequence: number[][] = [];

	available_sequence.push(resources);
	const process_length = available_sequence[available_sequence.length - 1].length;

	console.log('Available Resources: ', available_sequence[available_sequence.length - 1]);
	console.log('Need Matrix:');
	console.table(need);

	//? Apply the Bankers's Algorithm line by line
	for (let i = 0; i < need.length; i++) {
		let j = 0;
		if (!sequence.includes(i)) {
			for (j = 0; j < process_length; j++) {
				if (need[i][j] > available_sequence[available_sequence.length - 1][j]) {
					//! Break early if need is greater than available
					break;
				}
			}
			//! If equal, then the current available resources can accomodate the process
			if (process_length === j) {
				sequence.push(i); //? Add the process ID to the sequence

				//? Calculate the new available resources which is the sum of the current available resources and the allocation of the process
				let new_available = getNewAvailable(
					allocation[i],
					available_sequence[available_sequence.length - 1]
				);

				//? Push new value to track the sequence of resources
				available_sequence.push(new_available);

				i = -1; //? Reset the loop to check for other processes again
			}
		}
	}

	if (sequence.length !== allocation.length) {
		console.log('Deadlock detected');
		console.log('Sequence before deadlock:');
		console.log('P' + sequence.join(' -> P') + ` -> ? `);
		return { available_sequence, need: need, sequence: sequence, status: 2 };
	} else {
		console.log('No deadlock detected');
		console.log('Safe sequence is: ');
		console.log('P' + sequence.join(' -> P'));
		return { available_sequence, need: need, sequence: sequence, status: 1 };
	}
}

const getNewAvailable = (allocation: number[], resources: number[]) => {
	let available: number[] = [];
	for (let i = 0; i < resources.length; i++) {
		available[i] = resources[i] + allocation[i];
	}
	return available;
};

//? This function calculates the need matrix
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
