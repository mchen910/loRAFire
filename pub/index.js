const node_list = document.getElementById("node-list");
const nodes = [];
let node_card_template;

const fetchTemplates = async () => {
    node_card_template = await fetch('node-card.ejs').then(res => res.text());    
}

const fetchNodes = async () => {
    const nodes = await fetch("/api/nodes").then(res => res.json());
    console.log(nodes);
    nodes.forEach(node => genNodeCard(node));    
}

const genNodeCard = (node) => {
    const elem = document.createElement("div");
    elem.classList.add("node-card");
    elem.innerHTML = ejs.render(node_card_template, node);
    node_list.appendChild(elem);
}

const onNodeDetail = (node) => {
    // TODO 
}

const boot = async () => {
    await fetchTemplates();
    fetchNodes();
}
boot();
