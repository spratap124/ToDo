var mysql = require('mysql');
var uuid = require('uuid');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'todo'
});

connection.connect(function(err){
    if(err){
        console.log("Database connection error..",err);
    }else{
        console.log("connected to DB");
    }
});

var config = {
    cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-with']
    }
};

module.exports = [
    {
        path: '/getnotes',
        method: 'GET',
        handler: function (request, reply) {

           connection.query('SELECT * from notes', function (err, result, fields) {
                if (err)
                    console.log('The error is: ', err);
                else{
                    reply(result);
                }
            });
        },
        config: config
    },
    {
        path: '/newnote',
        method: 'POST',
        handler: function (request, reply) {
            var newNote = request.payload;
            var id = uuid.v1();
            newNote.id = id;

            connection.query('INSERT INTO notes SET ?', newNote, function (error, results, fields) {
                if (error) throw error;

                else{
                    reply(true);
                }
            });
        },
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        }
    },

    {
        path: '/edit/{noteId}',
        method: 'POST',
        handler: function (request, reply) {
            var newNoteValue = request.payload.noteValue;
            var id = request.params.noteId;
            connection.query('UPDATE notes SET ? WHERE ?', [{ noteValue: newNoteValue }, { id: id }],function (error, results, fields) {
                if (error) throw error;

                else {
                    reply(true);
                }
            });
        },
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        }
    },
    
    {
        path: '/deletenote',
        method: 'POST',
        handler: function (request, reply) {
            var deletedNote = request.payload;
            var noteId = deletedNote.id;
            var query = 'delete from notes where id = "'+noteId+'"';
            connection.query(query, function (error, results, fields) {
                if (error) throw error;

                else {
                    reply(true);
                }
            });
        },
        config: config
    },
    {
        path: '/toggledone',
        method: 'POST',
        handler: function (request, reply) {
            var pd = request.payload;
            var noteId = pd.id;
            var isDone = pd.isDone == true? 0:1;
            var query = 'update notes set isDone=' + Number(isDone) + ' where id="' + noteId + '"';

            connection.query(query, function (error, results, fields) {
                if (error) throw error;

                else {
                    reply(true);
                }
            });
        },
        config: config
    }
]