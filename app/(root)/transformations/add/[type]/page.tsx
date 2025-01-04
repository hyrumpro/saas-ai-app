import Header from "@/components/shared/Header";
import { transformationTypes } from "@/constants";


export default function transformationPage({ params: { type } }) {

        const transformation = transformationTypes[type];

    return (
        <div className="p-4">
            <Header
                title={transformation.title}
                subtitle={transformation.subtitle}
            />


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <h1>Hello World!!!</h1>
            </div>
        </div>
    );
}