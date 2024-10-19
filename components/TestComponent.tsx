import { useMode } from "@/lib/hooks/useModHook";

export const TestComponent = () => {
    const { mode, context } = useMode();

    return (
        <>
            <pre>{JSON.stringify(mode, null, 2)}</pre>
            <pre>{JSON.stringify(context, null, 2)}</pre>
        </>
    );
}