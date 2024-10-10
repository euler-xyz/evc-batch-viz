import { useState } from 'react';

import { decodeEVCBatch } from "./decode.js";


function App() {
    const [text, setText] = useState('');
    const [error, setError] = useState(undefined);
    const [decoded, setDecoded] = useState(undefined);

    let doDecode = () => {
        setError(undefined);
        setDecoded(undefined);

        let o;

        try {
            o = JSON.parse(text);
            o = decodeEVCBatch(o);
        } catch (e) {
            setError('' + e);
            return;
        }

        setDecoded(o);
    };

    return <div className="main">
        <h1>EVC Batch Viz</h1>

        <textarea placeholder="Encoded batch" onChange={e => setText(e.target.value)} />

        <button className="decode-button" onClick={() => doDecode()}>Decode</button>

        { error && <div className="error-box">
            { error }
        </div> }

        { decoded && <div className="decoded-box">
            <Decoded decoded={decoded} />
        </div> }
    </div>
}

function Decoded(props) {
    console.log(props.decoded);
    window.zz=props.decoded;
    return <>
        <div className="summary">{props.decoded.length} batch items</div>

        {props.decoded.map((item, i) => <div className="batch-item" key={i}>
            <div className="header-row">
                <div style={{ div: 30, }}>#{i}</div>

                <div>{item.decoded.functionName}</div>

                <Addr a={item.targetContract} />
            </div>

            <Args f={item.decoded.functionName} args={item.decoded.args} />
        </div>)}
    </>
}

function Args(props) {
    return <div className="args">
        { props.f === 'setCaps' && <div>
            <div>supplyCap &rarr; <Cap cap={props.args[0]} /></div>
            <div>borrowCap &rarr; <Cap cap={props.args[1]} /></div>
        </div>}

        { props.f === 'setInterestRateModel' && <div>
            <div>newModel &rarr; <Addr a={props.args[0]} /></div>
        </div>}

        { props.f === 'setLTV' && <div>
            <div>collateral &rarr; <Addr a={props.args[0]} /></div>
            <div>borrowLTV &rarr; <LTV ltv={props.args[1]} /></div>
            <div>liquidationLTV &rarr; <LTV ltv={props.args[2]} /></div>
            <div>rampDuration &rarr; <span>{props.args[3]}</span></div>
        </div>}

        { props.f === 'setHookConfig' && <div>
            <div>newHookTarget &rarr; <Addr a={props.args[0]} /></div>
            <div>newHookedOps &rarr; <span>{props.args[1]}</span></div>
        </div>}

        { props.f === 'setMaxLiquidationDiscount' && <div>
            <div>newDiscount &rarr; <span>{props.args[0]}</span></div>
        </div>}

        { props.f === 'setLiquidationCoolOffTime' && <div>
            <div>newCoolOffTime &rarr; <span>{props.args[0]}</span></div>
        </div>}


        { props.f === 'govSetConfig' && <div>
            <div>(price router method)</div>
            <div>base: <Addr a={props.args[0]} /></div>
            <div>quote: <Addr a={props.args[1]} /></div>
            <div>oracle &rarr; <Addr a={props.args[2]} /></div>
        </div>}

        { props.f === 'govSetResolvedVault' && <div>
            <div>(price router method)</div>
            <div>vault: <Addr a={props.args[0]} /></div>
            <div>set &rarr; <Bool v={props.args[1]} /></div>
        </div>}
    </div>
}

function Addr(props) {
    return <a href={`https://etherscan.io/address/${props.a}`} style={{ color: '#' + props.a.substr(2, 6)}}>{props.a}</a>
}

function Cap(props) {
    return <span>{props.cap}</span>
}

function LTV(props) {
    return <span>{props.ltv}</span>
}

function Bool(props) {
    return <span>{props.v ? 'true' : 'false'}</span>
}

export default App;
