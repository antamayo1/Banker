<script>
	import Instructions from '$lib/markdown/instruction.svx';
	import Summary from '$lib/markdown/summary.svx';
	import Success from '$lib/markdown/sucess.svx';
	import Failed from '$lib/markdown/failed.svx';
	import { fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { BankersAlgorithm } from '$lib/bankers/bankers.ts';

	let result = {
		status: 0
	};

	let toastVisible = false;
	let toastMessage = '';
	let toastType = 'info';

	function showToast(message, type = 'info', duration = 3000) {
		toastMessage = message;
		toastType = type;
		toastVisible = true;

		// Auto hide the toast after duration
		setTimeout(() => {
			toastVisible = false;
		}, duration);
	}

	let resources = [
		{ id: 1, name: 'A', value: 0 },
		{ id: 2, name: 'B', value: 0 },
		{ id: 3, name: 'C', value: 0 }
	];

	let processes = [
		{ id: 1, name: 'P0' },
		{ id: 2, name: 'P1' },
		{ id: 3, name: 'P2' }
	];

	const HandleBanker = () => {
		const resourcesValid = resources.every(
			(resource) =>
				resource.value !== null && resource.value !== '' && !isNaN(parseInt(resource.value))
		);

		if (!resourcesValid) {
			showToast('Please fill in all resource values', 'error');
			return;
		}

		let flat_available = [];
		for (let i = 0; i < resources.length; i++) {
			flat_available.push(parseInt(resources[i].value));
		}

		result = BankersAlgorithm(allocation, maxRequirements, flat_available);
		showToast("Banker's Algorithm completed successfully", 'success');
	};

	let allocation = Array(processes.length)
		.fill()
		.map(() => Array(resources.length).fill(0));

	let maxRequirements = Array(processes.length)
		.fill()
		.map(() => Array(resources.length).fill(0));

	$: {
		if (
			allocation.length !== processes.length ||
			(allocation[0] && allocation[0].length !== resources.length)
		) {
			const newAllocation = Array(processes.length)
				.fill()
				.map((_, pIndex) =>
					Array(resources.length)
						.fill()
						.map((_, rIndex) =>
							allocation[pIndex]?.[rIndex] !== undefined ? allocation[pIndex][rIndex] : 0
						)
				);
			allocation = newAllocation;
		}

		if (
			maxRequirements.length !== processes.length ||
			(maxRequirements[0] && maxRequirements[0].length !== resources.length)
		) {
			const newMaxRequirements = Array(processes.length)
				.fill()
				.map((_, pIndex) =>
					Array(resources.length)
						.fill()
						.map((_, rIndex) =>
							maxRequirements[pIndex]?.[rIndex] !== undefined ? maxRequirements[pIndex][rIndex] : 0
						)
				);
			maxRequirements = newMaxRequirements;
		}
	}

	function addResource() {
		const newId = resources.length > 0 ? Math.max(...resources.map((r) => r.id)) + 1 : 1;
		resources = [...resources, { id: newId, name: `${String.fromCharCode(64 + newId)}`, value: 0 }];
	}

	function removeResource() {
		if (resources.length > 1) {
			resources = resources.slice(0, -1);
		}
	}

	function addProcess() {
		const newId = processes.length > 0 ? Math.max(...processes.map((p) => p.id)) + 1 : 1;
		processes = [...processes, { id: newId, name: `P${newId - 1}` }];
	}

	function removeProcess() {
		if (processes.length > 1) {
			processes = processes.slice(0, -1);
		}
	}

	function handleValueChange(index, event) {
		const value = event.target.value;
		resources[index].value = value;
		resources = [...resources];
	}

	function handleAllocationChange(pIndex, rIndex, event) {
		const value = parseInt(event.target.value) || 0;
		allocation[pIndex][rIndex] = value;
		allocation = [...allocation];
	}

	function handleMaxRequirementChange(pIndex, rIndex, event) {
		const value = parseInt(event.target.value) || 0;
		maxRequirements[pIndex][rIndex] = value;
		maxRequirements = [...maxRequirements];
	}

	const getPhase = (sequence, index) => {
		if (index === 0) {
			return `Initially Available`;
		}
		return `After P${sequence[index - 1]}`;
	};
</script>

{#if toastVisible}
	<div
		class="toast toast-end z-50 w-full max-w-md px-4 sm:px-0"
		transition:fade={{ duration: 200 }}
	>
		<div class={`alert alert-${toastType} shadow-lg`}>
			<div class="flex items-center">
				{#if toastType === 'error'}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6 flex-shrink-0"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
						/></svg
					>
				{:else if toastType === 'success'}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6 flex-shrink-0"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/></svg
					>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6 flex-shrink-0"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/></svg
					>
				{/if}
				<span class="text-sm sm:text-base">{toastMessage}</span>
			</div>
		</div>
	</div>
{/if}

<div class="container mx-auto flex flex-col items-center gap-4 px-2 py-4 sm:gap-7 sm:px-4 sm:py-8">
	<div class="prose mb-4 max-w-none sm:mb-8">
		<Instructions />
	</div>

	<div class="flex w-full max-w-6xl flex-col items-start gap-4 sm:gap-5 md:flex-row">
		<div class="card bg-base-100 w-full flex-1 shadow-xl md:w-auto">
			<div class="card-body p-3 sm:p-6">
				<h2 class="card-title text-lg sm:text-xl">Available Resources</h2>
				<div class="-mx-3 overflow-auto sm:mx-0">
					<table class="table-zebra table-sm sm:table-md table">
						<thead>
							<tr class="bg-base-200 text-center">
								<th class="p-1 sm:p-2">ID</th>
								<th class="p-1 sm:p-2">Resource</th>
								<th class="p-1 sm:p-2">Value</th>
							</tr>
						</thead>
						<tbody>
							{#each resources as resource, index (resource.id)}
								<tr
									class="hover:bg-base-300 text-center"
									in:fade={{ duration: 200 }}
									animate:flip={{ duration: 200 }}
								>
									<th class="p-1 sm:p-2">{resource.id}</th>
									<td class="p-1 sm:p-2">{resource.name}</td>
									<td class="p-1 sm:p-2">
										<input
											required
											type="number"
											class="input input-bordered input-xs sm:input-sm w-14 sm:w-20"
											value={resource.value}
											min="0"
											on:input={(e) => handleValueChange(index, e)}
										/>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
				<div class="card-actions mt-2 justify-center gap-2 sm:justify-end">
					<button class="btn btn-primary btn-xs sm:btn-sm" on:click={addResource}
						>Add Resource</button
					>
					<button
						class="btn btn-secondary btn-xs sm:btn-sm"
						on:click={removeResource}
						disabled={resources.length <= 1}
					>
						Remove Resource
					</button>
				</div>
			</div>
		</div>

		<div class="card bg-base-100 w-full flex-1 shadow-xl md:w-auto">
			<div class="card-body p-3 sm:p-6">
				<h2 class="card-title text-lg sm:text-xl">Processes</h2>
				<div class="-mx-3 overflow-auto sm:mx-0">
					<table class="table-zebra table-sm sm:table-md table">
						<thead>
							<tr class="bg-base-200 text-center">
								<th class="p-1 sm:p-2">ID</th>
								<th class="p-1 sm:p-2">Process</th>
							</tr>
						</thead>
						<tbody>
							{#each processes as process, index (process.id)}
								<tr
									class="hover:bg-base-300 text-center"
									in:fade={{ duration: 200 }}
									animate:flip={{ duration: 200 }}
								>
									<th class="p-1 sm:p-2">{process.id}</th>
									<td class="p-1 sm:p-2">{process.name}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
				<div class="card-actions mt-2 justify-center gap-2 sm:justify-end">
					<button class="btn btn-primary btn-xs sm:btn-sm" on:click={addProcess}>Add Process</button
					>
					<button
						class="btn btn-secondary btn-xs sm:btn-sm"
						on:click={removeProcess}
						disabled={processes.length <= 1}
					>
						Remove Process
					</button>
				</div>
			</div>
		</div>
	</div>

	<div class="flex w-full max-w-6xl flex-col gap-4 sm:gap-5 lg:flex-row">
		<div class="card bg-base-100 w-full flex-1 shadow-xl md:w-auto">
			<div class="card-body p-3 sm:p-6">
				<h2 class="card-title text-lg sm:text-xl">Initial Allocation</h2>
				<div class="-mx-3 overflow-x-auto sm:mx-0">
					<table class="table-pin-rows table-zebra table-sm sm:table-md table">
						<thead>
							<tr class="bg-base-200 text-center">
								<th class="p-1 sm:p-2">Process</th>
								{#each resources as resource (resource.id)}
									<th class="p-1 sm:p-2" in:fade={{ duration: 200 }}>{resource.name}</th>
								{/each}
							</tr>
						</thead>
						<tbody>
							{#each processes as process, pIndex (process.id)}
								<tr class="hover:bg-base-300 text-center" in:fade={{ duration: 200 }}>
									<th class="p-1 sm:p-2">{process.name}</th>
									{#each resources as resource, rIndex (resource.id)}
										<td class="p-1 sm:p-2" in:fade={{ duration: 200 }}>
											<input
												required
												type="number"
												class="input input-bordered input-xs sm:input-sm w-10 sm:w-14"
												value={allocation[pIndex]?.[rIndex] || 0}
												min="0"
												on:input={(e) => handleAllocationChange(pIndex, rIndex, e)}
											/>
										</td>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<div class="card bg-base-100 w-full flex-1 shadow-xl md:w-auto">
			<div class="card-body p-3 sm:p-6">
				<h2 class="card-title text-lg sm:text-xl">Maximum Requirement</h2>
				<div class="-mx-3 overflow-x-auto sm:mx-0">
					<table class="table-pin-rows table-zebra table-sm sm:table-md table">
						<thead>
							<tr class="bg-base-200 text-center">
								<th class="p-1 sm:p-2">Process</th>
								{#each resources as resource (resource.id)}
									<th class="p-1 sm:p-2" in:fade={{ duration: 200 }}>{resource.name}</th>
								{/each}
							</tr>
						</thead>
						<tbody>
							{#each processes as process, pIndex (process.id)}
								<tr class="hover:bg-base-300 text-center" in:fade={{ duration: 200 }}>
									<th class="p-1 sm:p-2">{process.name}</th>
									{#each resources as resource, rIndex (resource.id)}
										<td class="p-1 sm:p-2" in:fade={{ duration: 200 }}>
											<input
												required
												type="number"
												class="input input-bordered input-xs sm:input-sm w-10 sm:w-14"
												value={maxRequirements[pIndex]?.[rIndex] || 0}
												min="0"
												on:input={(e) => handleMaxRequirementChange(pIndex, rIndex, e)}
											/>
										</td>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>

	<div class="prose mb-4 max-w-none sm:mb-8">
		<Summary />
	</div>

	<button
		class="btn btn-primary btn-md sm:btn-lg w-full max-w-xs font-bold"
		on:click={HandleBanker}
	>
		Find Safe Sequence
	</button>

	<div class="divider text-xl font-bold sm:text-2xl">RESULTS</div>

	{#if result.status === 0}
		<div class="prose mb-8 max-w-none p-4 text-center">
			Fill up the tables and click on "Find Safe Sequence"
		</div>
	{:else}
		<div class="flex w-full max-w-6xl flex-col gap-4 md:flex-row" in:fade={{ duration: 500 }}>
			<!-- Needs Matrix -->
			<div class="card bg-base-100 w-full flex-1 shadow-xl md:w-auto">
				<div class="card-body p-3 sm:p-6">
					<h2 class="card-title text-lg sm:text-xl">Calculated Needs</h2>
					<div class="-mx-3 overflow-x-auto sm:mx-0">
						<table class="table-pin-rows table-zebra table-sm sm:table-md table">
							<thead>
								<tr class="bg-base-200 text-center">
									<th class="p-1 sm:p-2">Process</th>
									{#each resources as resource (resource.id)}
										<th class="p-1 sm:p-2" in:fade={{ duration: 200 }}>{resource.name}</th>
									{/each}
								</tr>
							</thead>
							<tbody>
								{#each processes as process, pIndex (process.id)}
									<tr class="hover:bg-base-300 text-center" in:fade={{ duration: 200 }}>
										<th class="p-1 sm:p-2">{process.name}</th>
										{#each result.need[pIndex] as need, rIndex}
											<td class="p-1 sm:p-2">
												{need}
											</td>
										{/each}
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<!-- Available Resources Matrix -->
			<div class="card bg-base-100 w-full flex-1 shadow-xl md:w-auto">
				<div class="card-body p-3 sm:p-6">
					<h2 class="card-title text-lg sm:text-xl">Calculated Available Resources</h2>
					<div class="-mx-3 overflow-x-auto sm:mx-0">
						<table class="table-pin-rows table-zebra table-sm sm:table-md table">
							<thead>
								<tr class="bg-base-200 text-center">
									<th class="p-1 sm:p-2">Phase</th>
									{#each resources as resource (resource.id)}
										<th class="p-1 sm:p-2" in:fade={{ duration: 200 }}>{resource.name}</th>
									{/each}
								</tr>
							</thead>
							<tbody>
								{#each result.available_sequence as sequence, index}
									<tr class="hover:bg-base-300 text-center" in:fade={{ duration: 200 }}>
										<th class="p-1 sm:p-2">{getPhase(result.sequence, index)}</th>
										{#each sequence as available}
											<td class="p-1 sm:p-2" in:fade={{ duration: 200 }}>
												{available}
											</td>
										{/each}
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>

		<!-- Result Summary -->
		<div class="card bg-base-100 mt-4 w-full max-w-6xl shadow-xl">
			<div class="card-body">
				{#if result.status === 1}
					<div class="prose mb-4 max-w-none">
						<Success sequence={result.sequence} />
					</div>
				{:else}
					<div class="prose mb-4 max-w-none">
						<Failed sequence={result.sequence} />
					</div>
					<div class="alert alert-error">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
							/></svg
						>
						<span>No safe sequence found. Resource allocation could lead to deadlock.</span>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
