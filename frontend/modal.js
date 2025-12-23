export function openModal({
    title = '',
    contentHTML = '',
    submitLabel = 'Submit',
    cancelLabel = 'Cancel',
    onSubmit = null
}) {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black/60 flex items-center justify-center';

    overlay.innerHTML = `
        <div class="bg-gray-900 rounded w-full max-w-md p-4">
            <h3>${title}</h3>
            <div id="_modal_content">${contentHTML}</div>
            <div style="margin-top:12px; text-align:right;">
                <button id="_modal_cancel">${cancelLabel}</button>
                <button id="_modal_submit">${submitLabel}</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    overlay.querySelector('#_modal_cancel').onclick = close;
    overlay.querySelector('#_modal_submit').onclick = async () => {
        if (onSubmit) {
            const result = await onSubmit({ overlay, close });
            if (result !== false) close();
        }
        else {
            close();
        }
    };
    return { close };
};