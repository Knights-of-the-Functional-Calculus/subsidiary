THREE = {};
THREE.Math = {}
THREE.Math.lerp = (a, b, c) => {
    return (1 - c) * a + c * b;
}

module.exports = THREE;