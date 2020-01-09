export default interface IPopup {
    title: string;
    text: string;
    confirmationText: string;
    cancellationText: string;
    shown?: boolean;
    result?: 'good' | 'bad' | null;
}
