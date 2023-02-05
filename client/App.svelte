<script>
    import {Router, Route, Link} from "svelte-navigator";
    import Node from "src/Node.svelte"
    import Gateway from "src/Gateway.svelte";
</script>

<Router>
    <header>
        <h1>LoRA Managing Nodes + Gateways Data Platform</h1>

        <nav>
            <Link to="/">Home</Link>
            <Link to="node">Nodes</Link>
            <Link to="gate">Gateways</Link>
        </nav>
    </header>

    <main>
        <Route path="node/*nodeRoute" component={Node} />
        <Route path="gate/*gatewayRoute" component={Gateway} />

        <Route>
            <h3>Default</h3>
            <p>No Route could be matched.</p>
        </Route>
        
    </main>


</Router>

