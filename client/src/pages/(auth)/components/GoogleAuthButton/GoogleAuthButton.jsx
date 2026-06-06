import { images } from '@/assets';
import { Loader2 } from 'lucide-react';

function GoogleAuthButton({
    label = 'Tiếp tục với Google',
    disabled = false,
    loading = false,
    onClick,
}) {
    return (
        <button
            type="button"
            disabled={disabled || loading}
            onClick={onClick}
            className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-(--border-color) bg-(--card-surface-color) px-4 text-sm font-semibold text-(--text-primary) transition-all duration-300 hover:border-(--primary-color)/40 hover:bg-(--card-hover-color) disabled:pointer-events-none disabled:opacity-60"
        >
            {loading ? (
                <Loader2
                    aria-hidden
                    className="size-4 animate-spin text-(--muted-text)"
                />
            ) : (
                <img src={images.google} alt="Google" className="size-4" />
            )}

            {label}
        </button>
    );
}

export default GoogleAuthButton;
