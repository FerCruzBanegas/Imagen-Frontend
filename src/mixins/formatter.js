export default {
    methods: {
        toFloat(float) {
            return parseFloat(float.toString().replace(/,/g, '')).toFixed(2)
        }
    }
}