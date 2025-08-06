// Admin panel functionality
class AdminPanel {
    constructor() {
        this.questions = [];
        this.editingId = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadQuestions();
    }

    setupEventListeners() {
        // Form submission
        const form = document.getElementById('questionForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }

        // Cancel button
        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.resetForm();
            });
        }

        // Delete modal
        const deleteModal = document.getElementById('deleteModal');
        const cancelDelete = document.getElementById('cancelDelete');
        const confirmDelete = document.getElementById('confirmDelete');

        if (cancelDelete) {
            cancelDelete.addEventListener('click', () => {
                this.hideDeleteModal();
            });
        }

        if (confirmDelete) {
            confirmDelete.addEventListener('click', () => {
                this.confirmDelete();
            });
        }

        // Close modal on background click
        if (deleteModal) {
            deleteModal.addEventListener('click', (e) => {
                if (e.target === deleteModal) {
                    this.hideDeleteModal();
                }
            });
        }
    }

    async handleFormSubmit() {
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 mr-2 animate-spin"></i>Saving...';

        try {
            const formData = this.getFormData();
            
            if (this.editingId) {
                await this.updateQuestion(this.editingId, formData);
            } else {
                await this.addQuestion(formData);
            }

            this.resetForm();
            this.loadQuestions();
            
        } catch (error) {
            console.error('Error saving question:', error);
            this.showToast('Failed to save question', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }

    getFormData() {
        return {
            title: document.getElementById('title').value.trim(),
            desc: document.getElementById('desc').value.trim(),
            solutions: {
                global: document.getElementById('globalSolution').value.trim(),
                function: document.getElementById('functionSolution').value.trim(),
                args: document.getElementById('argsSolution').value.trim()
            }
        };
    }

    async addQuestion(data) {
        const response = await fetch('/api/add-question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            this.showToast('Question added successfully!', 'success');
        } else {
            throw new Error(result.message || 'Failed to add question');
        }
    }

    async updateQuestion(id, data) {
        const response = await fetch(`/api/questions/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            this.showToast('Question updated successfully!', 'success');
        } else {
            throw new Error(result.message || 'Failed to update question');
        }
    }

    async loadQuestions() {
        const loading = document.getElementById('questionsLoading');
        const list = document.getElementById('questionsList');
        const empty = document.getElementById('questionsEmpty');

        // Show loading
        loading.classList.remove('hidden');
        list.classList.add('hidden');
        empty.classList.add('hidden');

        try {
            const response = await fetch('/api/questions');
            const data = await response.json();

            if (data.success) {
                this.questions = data.data;
                this.renderQuestions();
            } else {
                throw new Error('Failed to load questions');
            }
        } catch (error) {
            console.error('Error loading questions:', error);
            this.showToast('Failed to load questions', 'error');
        } finally {
            loading.classList.add('hidden');
        }
    }

    renderQuestions() {
        const list = document.getElementById('questionsList');
        const empty = document.getElementById('questionsEmpty');

        if (this.questions.length === 0) {
            empty.classList.remove('hidden');
            return;
        }

        list.innerHTML = this.questions.map(question => this.createQuestionItem(question)).join('');
        list.classList.remove('hidden');

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Attach event listeners to action buttons
        this.attachActionListeners();
    }

    createQuestionItem(question) {
        return `
            <div class="p-6">
                <div class="flex items-start justify-between">
                    <div class="flex-1 min-w-0">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            ${this.escapeHtml(question.title)}
                        </h3>
                        <p class="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            ${this.escapeHtml(question.desc)}
                        </p>
                        <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span class="flex items-center">
                                <i data-lucide="calendar" class="w-4 h-4 mr-1"></i>
                                ${new Date(question.createdAt).toLocaleDateString()}
                            </span>
                            <span class="flex items-center">
                                <i data-lucide="code-2" class="w-4 h-4 mr-1"></i>
                                3 Solutions
                            </span>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2 ml-4">
                        <a href="/question/${question.id}" target="_blank" class="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" title="View">
                            <i data-lucide="external-link" class="w-4 h-4"></i>
                        </a>
                        <button class="edit-btn p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" data-id="${question.id}" title="Edit">
                            <i data-lucide="edit-3" class="w-4 h-4"></i>
                        </button>
                        <button class="delete-btn p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors" data-id="${question.id}" title="Delete">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    attachActionListeners() {
        // Edit buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                this.editQuestion(id);
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                this.showDeleteModal(id);
            });
        });
    }

    editQuestion(id) {
        const question = this.questions.find(q => q.id === id);
        if (!question) return;

        // Populate form
        document.getElementById('title').value = question.title;
        document.getElementById('desc').value = question.desc;
        document.getElementById('globalSolution').value = question.solutions.global;
        document.getElementById('functionSolution').value = question.solutions.function;
        document.getElementById('argsSolution').value = question.solutions.args;

        // Update form state
        this.editingId = id;
        document.getElementById('formTitle').innerHTML = '<i data-lucide="edit-3" class="w-5 h-5 inline mr-2"></i>Edit Question';
        document.getElementById('submitText').textContent = 'Update Question';

        // Scroll to form
        document.getElementById('questionForm').scrollIntoView({ behavior: 'smooth' });

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    resetForm() {
        // Clear form
        document.getElementById('questionForm').reset();

        // Reset form state
        this.editingId = null;
        document.getElementById('formTitle').innerHTML = '<i data-lucide="plus-circle" class="w-5 h-5 inline mr-2"></i>Add New Question';
        document.getElementById('submitText').textContent = 'Add Question';

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    showDeleteModal(id) {
        this.deleteId = id;
        const modal = document.getElementById('deleteModal');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    hideDeleteModal() {
        this.deleteId = null;
        const modal = document.getElementById('deleteModal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    async confirmDelete() {
        if (!this.deleteId) return;

        try {
            const response = await fetch(`/api/questions/${this.deleteId}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                this.showToast('Question deleted successfully!', 'success');
                this.loadQuestions();
                
                // Reset form if editing deleted question
                if (this.editingId === this.deleteId) {
                    this.resetForm();
                }
            } else {
                throw new Error(result.message || 'Failed to delete question');
            }
        } catch (error) {
            console.error('Error deleting question:', error);
            this.showToast('Failed to delete question', 'error');
        } finally {
            this.hideDeleteModal();
        }
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const icon = document.getElementById('toastIcon');
        const messageEl = document.getElementById('toastMessage');

        // Update content
        messageEl.textContent = message;
        
        // Update styling and icon based on type
        if (type === 'success') {
            toast.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg transform transition-transform duration-300';
            icon.setAttribute('data-lucide', 'check');
        } else {
            toast.className = 'fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg transform transition-transform duration-300';
            icon.setAttribute('data-lucide', 'alert-circle');
        }

        // Initialize icon
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Show toast
        toast.classList.remove('translate-x-full');

        // Hide after 4 seconds
        setTimeout(() => {
            toast.classList.add('translate-x-full');
        }, 4000);
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdminPanel();
});