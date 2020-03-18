
# Aquatic Ecosystem Simulation
## Abstract
This project is an attempt to emulate a self-regulated aquatic ecosystem with multiple artificial populations of fish and cyanobacteria. 

The movement was based on Craig Reynolds [boids algorithm](https://www.red3d.com/cwr/papers/1999/gdc99steer.pdf) and is influenced by factors such as intraspecific cohesion, population direction alignment, hunger, curiosity, interspecific divergence, etc.

Reproduction, propagation, and death are all ruled by mimicking simple biological systems. That is, the death of cyanobacteria occurs in function of nutrient scarcity in the environment and by being predated by the fish, while fish death is caused only by starvation as there are no fish predators in the ecosystem up until the current state of the project.

Besides these mechanisms, there is no interspecific competition, only intraspecific, that is, the fish do not compete for food with the bacteria, only with other schools/groups of fish.

The code is in Javascript and uses the p5.js library which was fundamental to the making of the animations and graphic interface.

The build is interactive and you can try it out [here!](https://heitorcoimbra.github.io/Aquatic-Ecosystem-Simulation/public_html)
## What it does
Through keyboard inputs the user can spawn schools of fish or populations of bacteria at will, creating endless possibilities of environment creation for the beings to inhabit.

Each cyanobacteria population starts at a healthy state with 120 cells that immediately start moving and organizing themselves in a natural circular pattern to maximize cohesion. If another bacteria group is nearby it will try and get as far from it as possible to mimick the avoidance of competition for food and dispersion.

Cyanobacteria propagate in a very rapid rate. This reproduction rate depends only on the size of the group, that is, as the family gets bigger and supposedly the nutrients get less and less abundant,  individual death gets more likely and propagation minimal.

Each school of fish starts healthy with moderate hunger and is populated by 30 adult fish, which will remain together and roam in search for food. If a population starts running out of food it will get desperate to find some and the adults will start to die while the school gets more and more chaotic.

When a group of fish has eaten enough for its survival it stops to go after bacteria and gets more and more stable. If a school eats more than it needs it starts to propagate, producing offspring. Newborn fish are created with a fraction of the parents size and try to stay closer to the centre of the school until they grow enough to be independent and be able to reproduce, becoming adult fish.
## How the movement works
The movement of both Cyanobacteria and Fish is heavily influenced by the boids algorithm. For an explanation of the boids algorithm see: [Boids Pseudocode]([http://www.kfish.org/boids/pseudocode.html](http://www.kfish.org/boids/pseudocode.html)).

Basically, each being is an object (of it's respective class) which has position and velocity as attributes. Each frame of the simulation the velocity us updated based on forces that act on each body individually, then the position is updated by adding the velocity to the previous position and just then the individual is drawn to its respective position.

The way these forces are calculated varies greatly between fish and bacteria, therefore I will be explaining them separately.
### For Cyanobacteria
The bacteria movement is influenced by just three forces: cohesion, separation and divergence. Each frame these forces are updated and each works its own way.
#### Cohesion:
Corresponds to the vector difference between the cell and the mean position of the group. Therefore, its orientation always is pointing to the center of the group and its magnitude is proportional to the distance of the cell and the group, so farther cells feel more cohesion.
#### Separation:
The separation force vector is the resultant of the sum of all separation forces between a cell and each of its peers. The separation of two individual cells is calculated by getting the vector difference between them and then multiplying it by the inverse of the cube of the norm of this vector. Multiplying it once by the inverse of the norm makes it a constant unitary vector, then multiplying it by the inverse of the square of the norm makes the magnitude of the vector be inversely proportional to the square of the distance, that is, as one cell gets nearer to the other, the separation grows quadratically.

### For Schools of Fish
*In progress...*
## The code underneath
*In progress...*
