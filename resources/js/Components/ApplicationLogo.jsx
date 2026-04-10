export default function ApplicationLogo(props) {
    return (
        <img
            {...props}
            src="/img/logo-garate.png"
            alt="Garate Logo"
            className={props.className}
            style={{ objectFit: 'contain' }}
        />
    );
}
