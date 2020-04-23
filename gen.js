// this file contains all functions that handle generations


function nextGeneration() {
    reset();
    // normalize the particles' fitness values
    normalizeFitness(allParticles);
    // create a new set of birds
    activeParticles = generate(allParticles);
    // copy the active into the all particles array
    allParticles = activeParticles.slice();
    genCount++;
}

function reset() {
    if (bestParticle) {
        bestParticle.score = 0;
    }
    scene = new Scene(sceneW, sceneH, topViewW, 0);
}

// generate a new population of particles
function generate(oldParticles) {
    let newParticles = [];
    for (let i = 0; i < oldParticles.length; i++) {
        newParticles[i] = poolSelection(oldParticles);
    }
    return newParticles;
}

// normalizes the fitness, expobentially to the score
function normalizeFitness(particles) {
    const len = particles.length;
    let sum = 0;
    for (let i = 0; i < len; i++) {
        let score = pow(particles[i].score, 2)
        particles[i].score = score;
        sum += score;
    }

    for (let i = 0; i < len; i++) {
        particles[i].fitness = particles[i].score / sum;
    }
}

// pick one particle from the array based on fitness
function poolSelection(particles) {
    let index = 0;
    let r = random(1);

    while (r > 0) {
        r -= particles[index].fitness;
        index++;
    }

    index--;

    return particles[index].copy();
}