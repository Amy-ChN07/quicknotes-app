// 1. SELECT ELEMENTS
const noteForm = document.querySelector('#note-form');
const noteInput = document.querySelector('#note-input');
const noteCategory = document.querySelector('#note-category');
const errorMessage = document.querySelector('#error-message');
const notesList = document.querySelector('#notes-list');
const noteCount = document.querySelector('#note-count');
const searchInput = document.querySelector('#search-input');
const clearAllBtn = document.querySelector('#clear-all-btn'); // Bonus

// 2. STATE & STORAGE
let notes = [];

function loadNotes() {
    const stored = localStorage.getItem('quicknotes');
    if (stored) {
        notes = JSON.parse(stored);
    } else {
        notes = [];
    }
}

function saveNotes() {
    localStorage.setItem('quicknotes', JSON.stringify(notes));
}

// 3. RENDER FUNCTION
function render() {
    // Clear the list safely
    notesList.innerHTML = '';
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    // Filter notes based on search
    const filteredNotes = notes.filter(note => 
        note.text.toLowerCase().includes(searchTerm)
    );

    // Update Count Message
    updateCount(notes.length);

    // Show/Hide Clear All button
    if (notes.length > 0) {
        clearAllBtn.classList.remove('hidden');
    } else {
        clearAllBtn.classList.add('hidden');
    }

    // Handle empty states
    if (notes.length === 0) {
        const emptyLi = document.createElement('li');
        emptyLi.textContent = "No notes yet. Add one above!";
        emptyLi.style.color = "#7f8c8d";
        emptyLi.style.fontStyle = "italic";
        notesList.appendChild(emptyLi);
        return;
    }

    if (filteredNotes.length === 0) {
        const noMatchLi = document.createElement('li');
        noMatchLi.textContent = "No notes match your search.";
        noMatchLi.style.color = "#7f8c8d";
        noMatchLi.style.fontStyle = "italic";
        notesList.appendChild(noMatchLi);
        return;
    }

    // Rebuild the list
    filteredNotes.forEach(note => {
        const li = document.createElement('li');
        li.className = `note-card category-${note.category}`;

        // Content container
        const contentDiv = document.createElement('div');
        contentDiv.className = 'note-content';

        // Note text
        const textP = document.createElement('p');
        textP.className = 'note-text';
        textP.textContent = note.text; // Safe from XSS

        // Metadata (Category & Date)
        const metaDiv = document.createElement('div');
        metaDiv.className = 'note-meta';

        const catSpan = document.createElement('span');
        catSpan.className = 'category-label';
        catSpan.textContent = note.category;

        const dateSpan = document.createElement('span');
        dateSpan.className = 'note-date';
        dateSpan.textContent = note.createdAt;

        metaDiv.appendChild(catSpan);
        metaDiv.appendChild(dateSpan);
        
        contentDiv.appendChild(textP);
        contentDiv.appendChild(metaDiv);

        // Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.dataset.id = note.id; // Store ID for deletion

        // Assemble card
        li.appendChild(contentDiv);
        li.appendChild(deleteBtn);
        
        notesList.appendChild(li);
    });
}

// 4. HELPER: Update Count
function updateCount(count) {
    if (count === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (count === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = `You have ${count} notes.`;
    }
}

// 5. EVENT LISTENERS

// Add Note
noteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const text = noteInput.value.trim();
    const category = noteCategory.value;

    // Validation
    if (text === '') {
        errorMessage.textContent = "Please type a note first.";
        return;
    }
    
    if (text.length > 200) {
        errorMessage.textContent = "Notes must be 200 characters or fewer.";
        return;
    }

    // Clear error if valid
    errorMessage.textContent = '';

    // Create object
    const newNote = {
        id: Date.now().toString(), // Unique ID
        text: text,
        category: category,
        createdAt: new Date().toLocaleString() // Readable date
    };

    notes.push(newNote);
    saveNotes();
    
    // Clear input and re-render
    noteInput.value = '';
    render();
});

// Delete Note (Event Delegation)
notesList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const idToDelete = e.target.dataset.id;
        
        // Filter out the note
        notes = notes.filter(note => note.id !== idToDelete);
        
        saveNotes();
        render();
    }
});

// Search
searchInput.addEventListener('input', () => {
    render();
});

// Clear All (Bonus)
clearAllBtn.addEventListener('click', () => {
    if (confirm("Delete all notes?")) {
        notes = [];
        saveNotes();
        render();
    }
});

// 6. INITIALIZATION
loadNotes();
render();