export default {
    methods: {
        sortDesc(array) {
            return array.sort((a, b) => b.id - a.id)
        }
    }
}