var axios = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 1000
});


var app = new Vue({
    el: "#app",
    data: {
        appName: "ToDo",
        newNoteValue: '',
        notes: [],
        isEmpty:false
    },
    methods: {
        makeNewNote: function () {
            console.log(this.newNoteValue.length);
            if(this.newNoteValue.length != 0){
                var newNote = {
                    noteValue: this.newNoteValue,
                    isDone: false,
                    isEditable:false
                }
                //
                axios.post('/newnote', newNote)
                    .then(function (response) {
                        if (response.status == 200) {
                            app.notes.push(newNote);
                        }
                    });
                this.newNoteValue = '';
            }else{
                this.isEmpty = true;
            }
        },
        editNote: function (noteId, index) {
            var newNoteValue = this.notes[index].noteValue;
            if (newNoteValue.length != 0) {
                var url = "/edit/"+noteId;
                var note = {
                    noteValue: newNoteValue
                }
                var self = this
                axios.post(url, note)
                    .then(function (response) {
                        if (response.status == 200 && response.data == true) {
                            self.notes[index].isEditable = false;
                        }
                    });
            }
        },
        deleteIt: function (index) {
            var deletedNote = JSON.parse(JSON.stringify(this.notes[index]));
            axios.post('/deletenote', deletedNote)
                .then(function (response) {
                    // this.notes = response.data; 
                    // app.notes = response.data;
                    if (response.data == true); {
                        app.notes.splice(index, 1);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });

        },
        toggleDone: function (index) {
            var pd = JSON.parse(JSON.stringify(this.notes[index]));
            var isDone = pd.isDone;

            axios.post('/toggledone', pd)
                .then(function (response) {
                    // this.notes = response.data; 
                    // app.notes = response.data;
                    if (response.data == true); {
                        console.log("updated");
                        app.notes[index].isDone = !isDone;
                    }
                })
                .catch(function (error) {
                    console.log(error); //no-console
                });
        }
    },
    computed: {

    },
    beforeCreate: function () {
        var self = this;
        axios.get('/getnotes')
            .then(function (response) {
                self.notes = response.data; 
                // app.notes = response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    }
});
