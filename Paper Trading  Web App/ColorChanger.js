function priceDirection(number) {
    const colors = {
    lightGreen: "#4EB849",
     darkGreen: "#18901E",
     darkRed: "#A00F0A",
    bloodRed: "#E61018",
    }
    if (number > 0 && number <= 0.99) {
        return colors.darkGreen;
    } else if (number > 0.99) {
         return colors.lightGreen;
    } else if (number < 0 && number >= -0.99) {
         return colors.darkRed;
    } else {
         return colors.bloodRed;
    }
}
export {priceDirection}
