import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import { Alert, Avatar, Badge, LoadingBlock } from '../../components/ui/Display';
import { useAsync } from '../../hooks/useAsync';
import { getPublicSubmissionInfo, submitPublicDocuments } from '../../services/interns';
import { APP } from '../../config';
import { orEmpty } from '../../lib/format';
import './submit-documents.css';

export default function SubmitDocuments() {
    const params = useParams();
    let ref = params['*'] || params.ref || params.id || '';

    // Extract reference if full path was matched
    if (!ref) {
        const match = window.location.pathname.match(/\/submit-documents\/(.+)$/i);
        if (match && match[1]) ref = decodeURIComponent(match[1]);
    }

    const { data: internInfo, loading, error, reload } = useAsync(
        (signal) => (ref ? getPublicSubmissionInfo(ref, { signal }) : Promise.resolve(null)),
        [ref],
    );

    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState('');
    const [docFile, setDocFile] = useState(null);

    const [mentorFeedback, setMentorFeedback] = useState('');
    const [trainingFeedback, setTrainingFeedback] = useState('');
    const [experienceFeedback, setExperienceFeedback] = useState('');
    const [rating, setRating] = useState(5);

    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const [submittedSuccess, setSubmittedSuccess] = useState(false);

    const photoInputRef = useRef(null);
    const docInputRef = useRef(null);

    const [photoDragging, setPhotoDragging] = useState(false);
    const [docDragging, setDocDragging] = useState(false);

    const processPhotoFile = (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setFormError('Please select a valid image file (JPG, PNG or WEBP) for your photo.');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            const mb = (file.size / (1024 * 1024)).toFixed(1);
            setFormError(`Photo size (${mb} MB) is too large. Maximum allowed file size is 10 MB.`);
            return;
        }
        setPhotoFile(file);
        setFormError('');
        const reader = new FileReader();
        reader.onload = () => setPhotoPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const processDocFile = (file) => {
        if (!file) return;
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type) && !file.type.startsWith('image/')) {
            setFormError('Please select a valid document (PDF or Image scan).');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            const mb = (file.size / (1024 * 1024)).toFixed(1);
            setFormError(`Document size (${mb} MB) is too large. Maximum allowed file size is 10 MB.`);
            return;
        }
        setDocFile(file);
        setFormError('');
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        processPhotoFile(file);
    };

    const handleDocChange = (e) => {
        const file = e.target.files?.[0];
        processDocFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!photoFile) {
            setFormError('Please upload your Intern Photo.');
            return;
        }
        if (!docFile) {
            setFormError('Please upload your Internship Document.');
            return;
        }

        if (photoFile.size > 10 * 1024 * 1024) {
            const mb = (photoFile.size / (1024 * 1024)).toFixed(1);
            setFormError(`Intern photo size (${mb} MB) exceeds the 10 MB limit. Please select a smaller image.`);
            return;
        }
        if (docFile.size > 10 * 1024 * 1024) {
            const mb = (docFile.size / (1024 * 1024)).toFixed(1);
            setFormError(`Internship document size (${mb} MB) exceeds the 10 MB limit. Please select a smaller document.`);
            return;
        }

        setSubmitting(true);

        const formData = new FormData();
        formData.append('photo', photoFile);
        formData.append('document', docFile);
        if (mentorFeedback.trim()) formData.append('mentor_feedback', mentorFeedback.trim());
        if (trainingFeedback.trim()) formData.append('training_feedback', trainingFeedback.trim());
        if (experienceFeedback.trim()) formData.append('experience_feedback', experienceFeedback.trim());
        if (rating) formData.append('rating', rating);

        try {
            await submitPublicDocuments(ref, formData);
            setSubmittedSuccess(true);
        } catch (err) {
            setFormError(err?.message || 'Submission failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="submit-doc-page">
                <LoadingBlock label="Loading submission form…" />
            </div>
        );
    }

    if (error || !internInfo) {
        return (
            <div className="submit-doc-page">
                <Alert variant="danger" title="Intern Record Not Found">
                    {error?.message || 'Could not locate an intern record for document collection.'}
                </Alert>
            </div>
        );
    }

    if (submittedSuccess || internInfo.already_submitted) {
        return (
            <div className="submit-doc-page">
                <div className="submit-doc-card submit-doc-success">
                    <div className="submit-doc-success__icon">
                        <Icon name="checkCircle" size={36} />
                    </div>
                    <h2 className="submit-doc-success__title">Submission Complete</h2>
                    <p className="submit-doc-success__msg">
                        Thank you, <strong>{internInfo.name}</strong>! Your Intern Photo, Internship Document, and feedback have been successfully submitted for verification.
                    </p>
                    <Badge variant="success" dot size="lg">
                        Documents Submitted — Pending Verification
                    </Badge>
                </div>
            </div>
        );
    }

    return (
        <div className="submit-doc-page">
            <header className="submit-doc-header">
                <div className="submit-doc-header__logo">
                    <Icon name="award" size={28} />
                    <span>{APP.name}</span>
                </div>
                <h1 className="submit-doc-header__title">Intern Document Collection & Feedback</h1>
                <p className="submit-doc-header__subtitle">
                    Please submit your official photo, internship completion document, and feedback to enable record verification.
                </p>
            </header>

            <div className="submit-doc-card">
                <div className="submit-doc-identity">
                    <Avatar name={internInfo.name} size="lg" />
                    <div className="submit-doc-identity__info">
                        <h3>{internInfo.name}</h3>
                        <p>
                            <span className="mono">{orEmpty(internInfo.intern_id)}</span> · {orEmpty(internInfo.internship_role || internInfo.department)} · {orEmpty(internInfo.college)}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="submit-doc-body">
                    {formError && (
                        <Alert variant="danger" style={{ marginBottom: '1.5rem' }}>
                            {formError}
                        </Alert>
                    )}

                    {/* Step 1: Documents */}
                    <div className="submit-doc-section">
                        <h3 className="submit-doc-section__title">
                            <Icon name="fileText" size={18} />
                            1. Upload Required Documents
                        </h3>
                        <p className="field__hint" style={{ marginBottom: '1rem' }}>
                            Both documents are required before admin sign-off and verification can occur.
                        </p>

                        <div className="submit-doc-upload-grid">
                            {/* Photo Upload */}
                            <input
                                ref={photoInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="visually-hidden"
                            />
                            <div
                                className={`upload-box ${photoFile ? 'has-file' : ''} ${photoDragging ? 'is-dragging' : ''}`}
                                onClick={() => photoInputRef.current?.click()}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setPhotoDragging(true);
                                }}
                                onDragLeave={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setPhotoDragging(false);
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setPhotoDragging(false);
                                    const file = e.dataTransfer.files?.[0];
                                    if (file) processPhotoFile(file);
                                }}
                            >
                                <div className="upload-box__icon">
                                    <Icon name="user" size={24} />
                                </div>
                                <div className="upload-box__label">
                                    {photoFile ? photoFile.name : 'Upload Intern Photo *'}
                                </div>
                                <div className="upload-box__hint">JPG, PNG or WEBP (Max 10MB) — Drag &amp; Drop supported</div>

                                {photoFile && (
                                    <div className="upload-box__preview">
                                        <Icon name="check" size={14} /> Photo Selected
                                    </div>
                                )}

                                {photoPreview && (
                                    <img
                                        src={photoPreview}
                                        alt="Photo preview"
                                        className="upload-box__img-preview"
                                    />
                                )}
                            </div>

                            {/* Document Upload */}
                            <input
                                ref={docInputRef}
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={handleDocChange}
                                className="visually-hidden"
                            />
                            <div
                                className={`upload-box ${docFile ? 'has-file' : ''} ${docDragging ? 'is-dragging' : ''}`}
                                onClick={() => docInputRef.current?.click()}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setDocDragging(true);
                                }}
                                onDragLeave={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setDocDragging(false);
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setDocDragging(false);
                                    const file = e.dataTransfer.files?.[0];
                                    if (file) processDocFile(file);
                                }}
                            >
                                <div className="upload-box__icon">
                                    <Icon name="fileCheck" size={24} />
                                </div>
                                <div className="upload-box__label">
                                    {docFile ? docFile.name : 'Upload Internship Document *'}
                                </div>
                                <div className="upload-box__hint">PDF or Image scan (Max 10MB) — Drag &amp; Drop supported</div>

                                {docFile && (
                                    <div className="upload-box__preview">
                                        <Icon name="check" size={14} /> Document Selected
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Step 2: Feedback & Rating */}
                    <div className="submit-doc-section">
                        <h3 className="submit-doc-section__title">
                            <Icon name="star" size={18} />
                            2. Internship Feedback & Rating
                        </h3>

                        <div className="field" style={{ marginBottom: '1.25rem' }}>
                            <label className="field__label">Overall Internship Rating</label>
                            <div className="star-rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={`star-btn ${star <= rating ? 'is-selected' : ''}`}
                                        onClick={() => setRating(star)}
                                    >
                                        <Icon name="star" size={28} />
                                    </button>
                                ))}
                                <span style={{ marginLeft: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                    {rating} / 5 Stars
                                </span>
                            </div>
                        </div>

                        <div className="field" style={{ marginBottom: '1.25rem' }}>
                            <label className="field__label">Mentor Feedback</label>
                            <textarea
                                className="input"
                                rows={3}
                                placeholder="Share your experience and guidance received from your mentor…"
                                value={mentorFeedback}
                                onChange={(e) => setMentorFeedback(e.target.value)}
                            />
                        </div>

                        <div className="field" style={{ marginBottom: '1.25rem' }}>
                            <label className="field__label">Training Feedback</label>
                            <textarea
                                className="input"
                                rows={3}
                                placeholder="Share feedback regarding training materials, tasks, and support…"
                                value={trainingFeedback}
                                onChange={(e) => setTrainingFeedback(e.target.value)}
                            />
                        </div>

                        <div className="field" style={{ marginBottom: '1.5rem' }}>
                            <label className="field__label">Overall Experience</label>
                            <textarea
                                className="input"
                                rows={3}
                                placeholder="Describe your overall internship learning and takeaway…"
                                value={experienceFeedback}
                                onChange={(e) => setExperienceFeedback(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        icon="send"
                        loading={submitting}
                        disabled={!photoFile || !docFile}
                        block
                        size="lg"
                    >
                        Submit Documents & Feedback
                    </Button>
                </form>
            </div>
        </div>
    );
}
