<script>
    import { Router, Route, Link } from "svelte-navigator";
    import { onMount } from "svelte";

    const url = ""; //ENTER API LINK HERE
    let getId, delId, putId = "";

    const apiData = []

    const postData = {
        location: {
            lat: 0,
            long: 0,
        },

        on: false,
        g_id: null,          
    }

    const getData = {}

    onMount(async () => {
        fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            apiData.set(data);
        }).catch(error => {
            console.log(error);
            return [];
        });
    });
    
    function returnNode(event) {
        event.preventDefault();

        fetch (url + "/" + getId)
         .then(response => response.json())
         .then(data => {
            console.log(data);
         }).catch(error => {
            console.log(error);
            return null;
         })
    };

    function deleteId(event) {
        event.preventDefault();
        
        fetch(url, {
            method:  'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                location: {
                    latitude: lat,
                    longitude: long,
                },

                online: (on === checked ? true : false),
                gatewayID: g_id,          
            })
        })
            .then(response => response.json())
            .then(result => console.log(result))
    }
    
    function formHandler(event) {
        event.preventDefault()

        fetch(url, {
            method:  'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                location: {
                    latitude: lat,
                    longitude: long,
                },

                online: (on === checked ? true : false),
                gatewayID: g_id,          
            })
        })
            .then(response => response.json())
            .then(result => console.log(result))
    }

    export let gatewayRoute;
</script>

<Router>
    <header>
        <h2>
            Managing Gateway Data Options
        </h2>

        <nav>
            <Link to="gateAllData">All Gateway Data</Link>
            <Link to="gateByID">Request Gateway By ID</Link>
            <Link to="addGates">Add Gateway</Link>
            <Link to="deleteGate">Delete Gateway</Link>
        </nav>
    </header>

    <main>
        <Route path="gateAllData">
            <div style="display: grid; place-items:center;">
                <div class="horizontal">
                    {#each apiData as d1}
                        <div>
                            {
                                d1.location,
                                d1.online, 
                                d1.gatewayID
                            }
                        </div>
                    {/each}
                </div>
            </div>
        </Route>


        <Route path="addNodes"> 
            <div class="PostNode">
                <h2>Add Nodes</h2>
                <section>
                    <form>
                        <div>
                            <label for="lat">Latitude</label>
                            <input type="number" id="lat" bind:value={postData.location.lat}>
                        </div>
                        <div>
                            <label for="long">Longitude</label>
                            <input type="number" id="long" bind:value={postData.location.long}>
                        </div>
                        <div>
                            <label for="on">Gateway Online</label>
                            <input type="text" id="on" bind:value={postData.on}>
                        </div>
                        <div>
                            <button type="submit" on:click|preventDefault={formHandler}>Add Gateway</button>
                        </div>
                    </form>
                </section>
            </div>
        </Route>

        <Route path="nodeByID">
            <div style="display: grid; place-items:center;">
                <div class="horizontal">
                    <div class="nodeIdData">
                        <section>
                            <form>
                                <div>
                                    <label for="id">Enter Gateway ID</label>
                                    <input type="text" id = "gateid" bind:value={getId}>
                                </div>
        
                                <div>
                                    <button type = "submit" on:click|preventDefault={formHandler}>Search for Gateway</button>
                                </div>
                            </form>
                        </section>
                    </div>
                </div>

                <div class="horizontal">
                        <div>
                            {
                                getData.location,
                                getData.online, 
                                getData.gatewayID
                            }
                        </div>
                </div>
            </div>

        </Route>

        <Route path="deleteNode">
            <div class="deleteNodeId">
                <section>
                    <form>
                        <div>
                            <label for="id">Enter Gateway ID</label>
                            <input type="text" id = "gateid" bind:value={getId}>
                        </div>

                        <div>
                            <button type = "submit" on:click|preventDefault={deleteId}>Delete Gateway</button>
                        </div>
                    </form>
                </section>
            </div>
        </Route>


    </main>
</Router>