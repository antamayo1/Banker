<script>
	import '../app.css';

	let { children } = $props();
</script>

<div class="navbar bg-base-100 shadow-sm">
	<div class="navbar-start">
		<div class="dropdown">
			<div tabindex="0" role="button" class="btn btn-ghost btn-circle">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h7"
					/>
				</svg>
			</div>
			<ul class="menu menu-sm dropdown-content bg-base-100 rounded-box w-xs shadow sm:w-sm">
				<li>
					<a href="https://github.com/antamayo1/Banker.git" class="btn btn-ghost font-bold"
						>Github Repository</a
					>
				</li>
				<li><a href="/algorithm" class=" btn btn-ghost">Algorithm Explanation</a></li>
				<div class="divider"></div>
				<li class="text-center font-bold">Aaron John N. Tamayo</li>
				<li class="text-center">CMSC-125 Machine Project</li>
			</ul>
		</div>
		<a class="btn btn-ghost text-xl" href="/">Banker's Algorithm</a>
	</div>
</div>

<div class="from-base-100 to-base-300 bg-gradient-to-br">
	{@render children()}
</div>
